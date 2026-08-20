const PROFILES = [
  { name: "Amina K.", phone: "+254 700 000 001", status: "Active" },
  { name: "John M.", phone: "+254 700 000 002", status: "Active" },
  { name: "Grace W.", phone: "+254 700 000 003", status: "Overdue" },
];

export default function CrmProfiles() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">CRM Profiles</h1>
      <p className="text-ink-dim mb-8">All borrower and client records</p>
      <div className="mb-6">
        <input
        type="search"
          placeholder="Search by name, phone, or ID..."
          className="w-full max-w-md border border-border rounded-md px-4 py-2 text-ink focus:outline-none focus:border-primary"
        />
      </div>
 <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ground text-ink-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Phone</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
