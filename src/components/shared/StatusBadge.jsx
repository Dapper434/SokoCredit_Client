const STATUS_STYLES = {
  paid: "bg-status-paid-bg text-status-paid-text border border-status-paid-border",
  due: "bg-status-due-bg text-status-due-text border border-status-due-border",
  missed: "bg-status-missed-bg text-status-missed-text border border-status-missed-border",
  partial: "bg-status-missed-bg text-status-missed-text border border-status-missed-border",
  overdue: "bg-status-overdue-bg text-status-overdue-text border border-status-overdue-border",
  pending: "bg-status-pending-bg text-status-pending-text border border-status-pending-border",
  restructured: "bg-status-restructured-bg text-status-restructured-text border border-status-restructured-border",
};

const TIER_STYLES = {
  A: "bg-status-paid-bg text-status-paid-text border border-status-paid-border",
  B: "bg-status-missed-bg text-status-missed-text border border-status-missed-border",
  C: "bg-ground-dim text-ink-dim border border-border",
};

export default function StatusBadge({ status, tier, className = "" }) {
  if (tier) {
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${TIER_STYLES[tier]} ${className}`}>
        Tier {tier}
      </span>
    );
  }

  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${style} ${className}`}>
      {status}
    </span>
  );
}