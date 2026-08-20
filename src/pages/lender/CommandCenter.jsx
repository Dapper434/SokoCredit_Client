 const STATS = [
  { label: "Active Loans", value: "128" },
  { label: "Pending Approvals", value: "14" },
  { label: "Overdue Accounts", value: "6" },
];

const ACTIVITY = [
  { text: "New loan application — Amina K.", when: "2h ago" },
  { text: "Repayment received — John M.", when: "5h ago" },
  { text: "Approval flagged for review — Grace W.", when: "1d ago" },
];

export default function CommandCenter() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Command Center</h1>
      <p className="text-ink-dim mb-8">Overview of lender activity today</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-lg p-5">
            <p className="text-xs uppercase text-ink-muted tracking-wide mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-ink">{stat.value}</p>
          </div>
        ))}
        </div>

         <div className="bg-surface border border-border rounded-lg p-5">
        <h2 className="text-lg font-semibold text-ink mb-4">Recent Activity</h2>
        <ul className="divide-y divide-border">
          {ACTIVITY.map((item) => (
            <li key={item.text} className="py-3 flex justify-between text-sm">
              <span className="text-ink">{item.text}</span>
              <span className="text-ink-muted">{item.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
