import { dailyTargets, liveCollections, borrowers } from "../../data/mockLenderData";
import StatusBadge from "../../components/shared/StatusBadge";

export default function Operations() {
  const overdueQueue = borrowers.filter((b) => b.status !== "paid");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Operations</h1>
      <p className="text-ink-dim mb-8">Thursday, 20 August 2026</p>

      {/* Daily targets ribbon */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-sidebar-bg text-white rounded-lg p-5">
          <p className="text-xs uppercase text-white/50 tracking-wide mb-2">Expected Today</p>
          <p className="text-2xl font-bold">KES {dailyTargets.expectedToday.toLocaleString()}</p>
        </div>
        <div className="bg-sidebar-bg text-white rounded-lg p-5">
          <p className="text-xs uppercase text-white/50 tracking-wide mb-2">Collected Today</p>
          <p className="text-2xl font-bold text-status-paid-border">
            KES {dailyTargets.collectedToday.toLocaleString()}
          </p>
        </div>
        <div className="bg-sidebar-bg text-white rounded-lg p-5">
          <p className="text-xs uppercase text-white/50 tracking-wide mb-2">Remaining</p>
          <p className="text-2xl font-bold text-status-due-border">
            KES {dailyTargets.remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Due/overdue queue */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Due / Overdue Queue</h2>
            <span className="text-xs text-ink-muted">{overdueQueue.length} records</span>
          </div>
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
              {overdueQueue.map((b) => (
                <tr key={b.id} className="hover:bg-ground">
                  <td className="px-5 py-3 text-ink font-medium">{b.displayName}</td>
                  <td className="px-5 py-3 text-ink-dim">
                    {b.market} · {b.stall}
                  </td>
                  <td className="px-5 py-3 text-ink-dim">{b.phone}</td>
                  <td className="px-5 py-3 text-status-overdue-text font-semibold">
                    {b.missedAmount ? `KES ${b.missedAmount.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-dim">
                    {b.daysLate ? `${b.daysLate}d` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            {liveCollections.map((c, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-ink font-medium text-sm">{c.name}</p>
                  <p className="text-status-paid-text font-semibold text-sm">
                    KES {c.amount.toLocaleString()}
                  </p>
                </div>
                <p className="text-ink-muted text-xs">
                  {c.time} · {c.channel} · {c.reference}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}