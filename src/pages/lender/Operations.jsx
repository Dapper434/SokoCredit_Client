export default function Operations() {
  return (
    <div className="p-8">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-ink mb-1">Operations</h1>
      <p className="text-ink-dim mb-8">Day-to-day loan operations and disbursements</p>

      {/* Status filter tabs — wire up real filtering later */}
      <div className="flex gap-2 mb-6">
        <button className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-md">
          All
        </button>
        <button className="bg-surface border border-border text-ink-dim text-sm font-semibold px-4 py-2 rounded-md">
          Disbursed
        </button>
        <button className="bg-surface border border-border text-ink-dim text-sm font-semibold px-4 py-2 rounded-md">
          Due Today
        </button>
      </div>

      {/* Operations list — placeholder rows, replace with real data */}
      <div className="bg-surface border border-border rounded-lg divide-y divide-border">
        <div className="flex justify-between items-center px-5 py-4">
          <div>
            <p className="text-ink font-medium">Loan #10432 — Amina K.</p>
            <p className="text-ink-muted text-sm">Disbursed today, 9:14 AM</p>
          </div>
          <span className="bg-status-due-bg border border-status-due-border text-status-due-text text-xs font-semibold px-3 py-1 rounded-full">
            Due Today
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <div>
            <p className="text-ink font-medium">Loan #10428 — John M.</p>
            <p className="text-ink-muted text-sm">Disbursed yesterday</p>
          </div>
          <span className="bg-status-due-bg border border-status-due-border text-status-due-text text-xs font-semibold px-3 py-1 rounded-full">
            Disbursed
          </span>
        </div>
      </div>
    </div>
  );
}