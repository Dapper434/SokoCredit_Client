export default function ApprovalDesk() {
  return (
    <div className="p-8">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-ink mb-1">Approval Desk</h1>
      <p className="text-ink-dim mb-8">Loan applications awaiting review</p>

      {/* Pending approvals — placeholder cards, replace with real data */}
      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-lg p-5 flex justify-between items-center">
          <div>
            <p className="text-ink font-semibold">Grace W. — KES 25,000</p>
            <p className="text-ink-muted text-sm">Submitted 3h ago</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md">
              Approve
            </button>
            <button className="bg-surface border border-border text-ink-dim text-sm font-semibold px-4 py-2 rounded-md">
              Decline
            </button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-5 flex justify-between items-center">
          <div>
            <p className="text-ink font-semibold">Peter O. — KES 12,500</p>
            <p className="text-ink-muted text-sm">Submitted 6h ago</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md">
              Approve
            </button>
            <button className="bg-surface border border-border text-ink-dim text-sm font-semibold px-4 py-2 rounded-md">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}