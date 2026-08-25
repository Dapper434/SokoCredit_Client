import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { borrowerProfile, repaymentDiscipline } from "../../data/mockCustomerData";

const TIER_STYLES = {
  A: "bg-primary",
  B: "bg-status-due-text",
  C: "bg-ink-muted",
};

export default function MyHub() {
  const navigate = useNavigate();
  const {
    tier,
    tierLabel,
    availableCredit,
    sokoPoints,
    hasActiveLoan,
    inArrears,
    savingsDays,
    savingsGoalDays,
    onTimeRate,
    completedCycles,
    reliability,
  } = borrowerProfile;

  const isFirstTimer = savingsDays < savingsGoalDays;
  const applyDisabled = inArrears || isFirstTimer;
  const disabledReason = inArrears
    ? "You have an outstanding arrears balance"
    : isFirstTimer
    ? `Savings not yet mature — ${savingsGoalDays - savingsDays} days remaining`
    : null;

  return (
    <div className="pb-8 lg:pb-12 lg:max-w-6xl lg:mx-auto lg:px-8 lg:pt-8">
      <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6 lg:items-start">
        {/* Hero card */}
        <div className="mx-5 mt-5 lg:mx-0 lg:mt-0 rounded-md bg-ink text-white overflow-hidden lg:col-start-1 lg:row-start-1">
          <div className="px-5 pt-5 pb-4 lg:px-8 lg:pt-8 lg:pb-6">
            <div className="flex items-start justify-between mb-4 lg:mb-6">
              <div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-semibold uppercase tracking-wider mb-3 text-white ${TIER_STYLES[tier]}`}>
                  Tier {tier} · {tierLabel}
                </div>
                <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">Available Credit</p>
                <p className="text-3xl lg:text-5xl font-bold tracking-tight font-mono">KES {availableCredit.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">SokoPoints</p>
                <p className="text-2xl lg:text-4xl font-bold font-mono text-accent">{sokoPoints}</p>
              </div>
            </div>

            {hasActiveLoan && (
              <button
                onClick={() => navigate("/customer/portfolio")}
                className="w-full lg:w-auto lg:px-6 py-2 lg:py-2.5 rounded bg-white/10 border border-white/20 text-xs lg:text-sm font-semibold text-white/80 hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-status-paid-border animate-pulse" />
                Active loan — view portfolio
              </button>
            )}
          </div>
        </div>

        {/* Savings streak (first-timer only) */}
        {isFirstTimer && (
          <div className="mx-5 mt-4 lg:mx-0 lg:mt-0 p-4 lg:p-6 rounded-md bg-surface border border-border lg:col-start-2 lg:row-start-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide">
                  {savingsGoalDays}-Day Savings Gate
                </p>
                <p className="text-[11px] text-ink-muted mt-0.5">Complete to unlock loan eligibility</p>
              </div>
              <span className="font-mono font-bold text-primary text-lg">
                {savingsDays}
                <span className="text-xs text-ink-muted font-normal">/{savingsGoalDays}</span>
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: savingsGoalDays }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-sm ${i < savingsDays ? "bg-primary" : "bg-border-dim"}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-ink-muted font-mono">
              {savingsGoalDays - savingsDays} more days until your first loan is available
            </p>
          </div>
        )}

        {/* Repayment discipline */}
        <div className="mx-5 mt-4 lg:mx-0 lg:mt-6 p-4 lg:p-6 rounded-md bg-surface border border-border lg:col-start-1 lg:row-start-2">
          <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-4">Repayment Discipline</p>

          <div className="flex gap-4 mb-4">
            <div className="flex-1 text-center p-3 lg:p-4 rounded bg-ground">
              <p className="text-xl lg:text-2xl font-bold font-mono text-status-paid-text">{onTimeRate}%</p>
              <p className="text-[10px] lg:text-xs text-ink-muted mt-0.5">On-time rate</p>
            </div>
            <div className="flex-1 text-center p-3 lg:p-4 rounded bg-ground">
              <p className="text-xl lg:text-2xl font-bold font-mono text-ink">{completedCycles}</p>
              <p className="text-[10px] lg:text-xs text-ink-muted mt-0.5">Completed cycles</p>
            </div>
            <div className="flex-1 text-center p-3 lg:p-4 rounded bg-ground">
              <p className="text-xl lg:text-2xl font-bold font-mono text-ink">{reliability}</p>
              <p className="text-[10px] lg:text-xs text-ink-muted mt-0.5">Reliability</p>
            </div>
          </div>

          <div className="h-24 lg:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repaymentDiscipline} barSize={20} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#78736A" }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 9, fill: "#78736A" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: "#1A1912", border: "none", borderRadius: 4, fontSize: 11 }}
                  labelStyle={{ color: "#9E9A94" }}
                  itemStyle={{ color: "white" }}
                  formatter={(v) => [`${v}%`, "On-time"]}
                />
                <Bar dataKey="rate" radius={[2, 2, 0, 0]}>
                  {repaymentDiscipline.map((entry, i) => (
                    <Cell key={i} fill={entry.rate >= 95 ? "#1B5E38" : entry.rate >= 88 ? "#B45309" : "#C2410C"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mx-5 mt-5 lg:mx-0 lg:mt-6 mb-5 lg:mb-0 lg:col-start-2 lg:row-start-2">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5">
            {[
              { label: "Statements", icon: "📄", to: "/customer/profile" },
              { label: "History", icon: "📋", to: "/customer/portfolio" },
              { label: "Support", icon: "💬", to: null },
            ].map(({ label, icon, to }) => (
              <button
                key={label}
                onClick={to ? () => navigate(to) : undefined}
                className="flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 py-3.5 lg:py-3 lg:px-4 rounded border border-border bg-surface text-[11px] lg:text-sm font-medium text-ink-dim hover:bg-ground transition-colors"
              >
                <span className="text-lg">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Apply CTA — spans full width beneath both columns on desktop */}
        <div className="mx-5 mt-4 lg:mx-0 lg:mt-6 lg:col-start-1 lg:col-span-2 lg:row-start-3">
          <button
            onClick={applyDisabled ? undefined : () => navigate("/customer/loan")}
            disabled={applyDisabled}
            className={`w-full py-4 lg:py-5 rounded font-semibold text-sm lg:text-base flex items-center justify-center gap-2 transition-all ${
              applyDisabled
                ? "bg-ground-dim text-ink-muted cursor-not-allowed border border-border"
                : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
            }`}
          >
            Apply for Loan
            {!applyDisabled && (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          {applyDisabled && disabledReason && (
            <p className="text-[11px] text-status-missed-text mt-2 text-center font-medium">{disabledReason}</p>
          )}
        </div>
      </div>
    </div>
  );
}
