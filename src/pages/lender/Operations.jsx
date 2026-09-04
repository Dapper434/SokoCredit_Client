import { useEffect, useState } from "react";
import { dailyTargets as baseTargets } from "../../data/mockLenderData";
import StatusBadge from "../../components/shared/StatusBadge";
import { getSession, getActiveLoans, getPaidLoans, getSavingsActivity } from "../../lib/api";

export default function Operations() {
  const session = getSession();
  const instId = session?.user?.lending_institution_id || 1;
  
  const [activeLoans, setActiveLoans] = useState([]);
  const [paidLoans, setPaidLoans] = useState([]);
  const [savingsRows, setSavingsRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("collections"); // "collections" | "savings"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [active, paid, savings] = await Promise.all([
          getActiveLoans(),
          getPaidLoans(),
          getSavingsActivity().catch(() => []),
        ]);
        setActiveLoans(active);
        setPaidLoans(paid);
        setSavingsRows(savings);
      } catch (err) {
        console.error("Failed to fetch operations data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hasData = activeLoans.length > 0 || paidLoans.length > 0;
  
  // Scaling targets (dummy for now)
  const multiplier = 1 + (instId * 0.2);
  const dailyTargets = {
    expectedToday: baseTargets.expectedToday * multiplier,
    collectedToday: baseTargets.collectedToday * multiplier,
    remaining: (baseTargets.expectedToday * multiplier) - (baseTargets.collectedToday * multiplier),
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Operations</h1>
      <p className="text-ink-dim mb-8">Thursday, 20 August 2026</p>

      {/* Daily targets ribbon */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-sidebar-bg text-white rounded-lg p-5">
          <p className="text-xs uppercase text-white/50 tracking-wide mb-2">Expected Today</p>
          <p className="text-2xl font-bold">KES {hasData ? dailyTargets.expectedToday.toLocaleString() : "0"}</p>
        </div>
        <div className="bg-sidebar-bg text-white rounded-lg p-5">
          <p className="text-xs uppercase text-white/50 tracking-wide mb-2">Collected Today</p>
          <p className="text-2xl font-bold text-status-paid-border">
            KES {hasData ? dailyTargets.collectedToday.toLocaleString() : "0"}
          </p>
        </div>
        <div className="bg-sidebar-bg text-white rounded-lg p-5">
          <p className="text-xs uppercase text-white/50 tracking-wide mb-2">Remaining</p>
          <p className="text-2xl font-bold text-status-due-border">
            {hasData ? `KES ${dailyTargets.remaining.toLocaleString()}` : "--"}
          </p>
        </div>
      </div>

      {/* View switcher */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {[
          ["collections", "Due / Overdue + Collections"],
          ["savings", "Savings Activity"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "savings" && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Savings Activity</h2>
            <span className="text-xs text-ink-muted">{savingsRows.length} customers</span>
          </div>
          {savingsRows.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-ground text-ink-muted text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-right px-5 py-3">Savings Balance</th>
                  <th className="text-left px-5 py-3">14-day Gate</th>
                  <th className="text-left px-5 py-3">30-day Unlock</th>
                  <th className="text-left px-5 py-3">Recent Deposits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {savingsRows.map((r) => (
                  <tr key={r.customer_profile_id} className="hover:bg-ground align-top">
                    <td className="px-5 py-3 text-ink font-medium">{r.customer_name}</td>
                    <td className="px-5 py-3 text-ink-dim">{r.phone || "—"}</td>
                    <td className="px-5 py-3 text-right font-mono text-ink">
                      KES {Number(r.savings_balance).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      {r.gate_complete ? (
                        <span className="text-status-paid-text font-semibold">Complete</span>
                      ) : (
                        <span className="text-ink-dim">{r.savings_days}/{r.gate_goal} days</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-ink-dim">
                      {r.days_to_full_limit === 0
                        ? <span className="text-status-paid-text font-semibold">Unlocked</span>
                        : `${r.savings_days}/${r.full_limit_goal} · ${r.days_to_full_limit} to go`}
                    </td>
                    <td className="px-5 py-3 text-ink-dim">
                      {r.recent_deposits.length === 0 ? (
                        <span className="text-ink-muted">—</span>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          {r.recent_deposits.slice(0, 3).map((d, i) => (
                            <span key={i} className="text-xs font-mono">
                              KES {Number(d.amount).toLocaleString()}
                              <span className={
                                d.status === "completed" ? " text-status-paid-text"
                                : d.status === "failed" ? " text-status-overdue-text"
                                : " text-status-due-text"
                              }> · {d.status}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <h3 className="text-sm font-bold text-ink mb-2">No savings activity yet</h3>
              <p className="text-[11px] text-ink-muted max-w-sm mx-auto leading-relaxed">
                Customer savings deposits and gate progress will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${tab === "savings" ? "hidden" : ""}`}>
        {/* Due/overdue queue */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Due / Overdue Queue</h2>
            <span className="text-xs text-ink-muted">{activeLoans.length} records</span>
          </div>
          {activeLoans.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-ground text-ink-muted text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3">Borrower</th>
                  <th className="text-left px-5 py-3">Market / Stall</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-left px-5 py-3">Missed</th>
                  <th className="text-left px-5 py-3">Days Late</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-ground">
                    <td className="px-5 py-3 text-ink font-medium">{loan.customer_name}</td>
                    <td className="px-5 py-3 text-ink-dim">
                      {loan.market || "Soko Market"} · Stall {loan.customer_profile_id * 10}
                    </td>
                    <td className="px-5 py-3 text-ink-dim">{loan.phone || "+254 7XX"}</td>
                    <td className="px-5 py-3 text-status-overdue-text font-semibold">
                      {loan.outstanding_balance ? `KES ${loan.outstanding_balance.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-dim">
                      {loan.status === "overdue" ? "Yes" : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={loan.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-full border border-dashed border-border-dim flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ink-muted opacity-50">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-ink mb-2">No due or overdue accounts</h3>
              <p className="text-[11px] text-ink-muted max-w-sm mx-auto leading-relaxed">
                Once borrowers have active loans with upcoming repayments, your daily collection queue will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Live collections feed */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-paid-border animate-pulse" />
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wide">
              Live Collections
            </h2>
          </div>
          <div className="divide-y divide-border">
            {paidLoans.length > 0 ? (
              paidLoans.map((loan) => (
                <div key={loan.id} className="px-5 py-3">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-ink font-medium text-sm">{loan.customer_name}</p>
                    <p className="text-status-paid-text font-semibold text-sm">
                      KES {loan.total_repaid?.toLocaleString() || loan.principal.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-ink-muted text-xs">
                    {new Date(loan.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · {loan.updated_at.split("T")[0]} · Completed
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-ground flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-ink-muted opacity-50">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-ink mb-1">No transactions today</h3>
                <p className="text-[10px] text-ink-muted leading-relaxed">
                  M-Pesa, KCB, and cash payments will stream here in real time once borrowers start repaying.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}