import { useState } from "react";
import { staffRoster, changeRequests, changeableFields, allMarkets } from "../../data/mockLenderData";
import StatusBadge from "../../components/shared/StatusBadge";

const STAFF_STATUS_STYLES = {
  active: "bg-status-paid-bg text-status-paid-text border-status-paid-border",
  inactive: "bg-status-overdue-bg text-status-overdue-text border-status-overdue-border",
  invited: "bg-status-due-bg text-status-due-text border-status-due-border",
};

const CHANGE_STATUS_LABELS = {
  pending: "Pending SokoCredit Review",
  approved: "Approved",
  rejected: "Rejected",
};

export default function StaffAccess() {
  const [showInvite, setShowInvite] = useState(false);
  const [showChangeReq, setShowChangeReq] = useState(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState("loan_officer");
  const [inviteMarkets, setInviteMarkets] = useState([]);

  const [changeNewValue, setChangeNewValue] = useState("");
  const [changeReason, setChangeReason] = useState("");

  const toggleInviteMarket = (m) => {
    setInviteMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const activeCount = staffRoster.filter((s) => s.status === "active").length;
  const bmCount = staffRoster.filter((s) => s.role === "branch_manager").length;
  const loCount = staffRoster.filter((s) => s.role === "loan_officer").length;
  const marketCount = [...new Set(staffRoster.flatMap((s) => s.markets).filter((m) => m !== "All"))].length;

  const fieldForChange = changeableFields.find((f) => f.key === showChangeReq);
  const inviteValid = inviteName && inviteEmail && !(inviteRole === "loan_officer" && inviteMarkets.length === 0);
  const changeValid = changeNewValue && changeReason;

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1100px]">
      {/* Header metrics */}
      <div className="grid grid-cols-4 gap-3">
      {[
          { label: "Total Active Staff", value: activeCount },
          { label: "Branch Managers", value: bmCount },
          { label: "Field Loan Officers", value: loCount },
          { label: "Covered Market Clusters", value: marketCount },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface border border-border rounded p-4">
            <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-2">{label}</p>
            <p className="text-2xl font-bold font-mono text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Staff roster */}
      <div className="bg-surface border border-border rounded overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-ground">
          <h2 className="text-sm font-bold text-ink">Staff Roster</h2>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Staff Member
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-ground">
              {["Staff Member", "Role", "Assigned Markets", "Assigned Borrowers", "Last Active", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-ink-muted uppercase tracking-wider px-4 py-2.5 font-mono">
                  {h}
                </th>
              ))}
                 </tr>
          </thead>
          <tbody>
            {staffRoster.map((s) => (
              <tr key={s.id} className="border-t border-border-dim hover:bg-ground transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${
                        s.role === "branch_manager" ? "bg-primary" : "bg-ink-dim"
                      }`}
                          >
                      {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink">{s.name}</p>
                      <p className="text-[10px] text-ink-muted font-mono">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      s.role === "branch_manager"
                        ? "bg-primary-light text-primary border-status-paid-border"
                        : "bg-ground-dim text-ink-dim border-border"
                    }`}
                     >
                    {s.role === "branch_manager" ? "Branch Manager" : "Loan Officer"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-dim font-mono">{s.markets.join(", ")}</td>
                <td className="px-4 py-3 text-sm font-mono font-semibold text-ink">{s.borrowers > 0 ? s.borrowers : "—"}</td>
                <td className="px-4 py-3 text-xs text-ink-muted font-mono">{s.lastActive}</td>
                  <td className="px-4 py-3">
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${STAFF_STATUS_STYLES[s.status]}`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {s.status === "invited" ? (
                      <button className="text-[10px] font-mono text-status-due-text hover:underline">Resend invite</button>
                    ) : (
                      <>
                        <button className="text-[10px] font-mono text-ink-dim border border-border px-2 py-0.5 rounded hover:bg-ground">
                          Edit
                        </button>
                        <button className="text-[10px] font-mono text-status-overdue-text hover:underline">
                          {s.status === "active" ? "Deactivate" : "Reactivate"}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Settings & Change Requests */}
      <div className="bg-surface border border-border rounded overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-ground">
          <h2 className="text-sm font-bold text-ink">Settings & Change Requests</h2>
          <p className="text-[11px] text-ink-muted mt-0.5">
            Settlement and rate fields cannot be edited directly — changes route through SokoCredit compliance review.
          </p>
        </div>
          <div className="px-5 py-4 border-b border-border">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-3">Current Configuration</p>
          <div className="grid grid-cols-2 gap-3">
            {changeableFields.map(({ key, label, current }) => (
              <div key={key} className="flex items-center justify-between py-2.5 px-3 rounded bg-ground border border-border">
                <div>
                  <p className="text-[10px] text-ink-muted font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-mono font-semibold text-ink mt-0.5">{current}</p>
                     </div>
                <button
                  onClick={() => {
                    setShowChangeReq(key);
                    setChangeNewValue("");
                    setChangeReason("");
                  }}
                   className="text-[10px] font-semibold text-primary border border-status-paid-border bg-status-paid-bg px-2 py-1 rounded hover:opacity-80 transition-opacity whitespace-nowrap ml-3"
                >
                  Request Change
                </button>
              </div>
            ))}
          </div>
        </div>
         <div className="px-5 py-4">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-3">Request History</p>
          <table className="w-full">
            <thead>
              <tr>
                {["Field", "Current", "Requested", "Status", "Date", "Reason"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-ink-muted uppercase tracking-wider pb-2 pr-4 font-mono">
                    {h}
                  </th>
                ))}
                  </tr>
            </thead>
            <tbody>
              {changeRequests.map((cr) => (
                <tr key={cr.id} className="border-t border-border-dim">
                  <td className="py-3 pr-4 text-xs font-semibold text-ink">{cr.field}</td>
                  <td className="py-3 pr-4 text-xs font-mono text-ink-muted line-through">{cr.oldValue}</td>
                   <td className="py-3 pr-4 text-xs font-mono font-semibold text-ink">{cr.newValue}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={cr.status === "approved" ? "paid" : cr.status === "rejected" ? "overdue" : "pending"} className="whitespace-nowrap" />
                  </td>
                  <td className="py-3 pr-4 text-[11px] font-mono text-ink-muted">{cr.date}</td>
                  <td className="py-3 text-[11px] text-ink-dim max-w-[200px] truncate">{cr.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Invite staff modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setShowInvite(false)}>
          <div className="bg-surface rounded border border-border w-full max-w-md p-5 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">Add Staff Member</h3>
              <button onClick={() => setShowInvite(false)} className="text-ink-muted hover:text-ink"></button>
                 <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
              <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Full Name</label>
                     <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="e.g. Alice Wanjiku" className="px-3 py-2 rounded border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Email Address</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="e.g. alice@company.com" className="px-3 py-2 rounded border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
             <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Phone (2547XXXXXXXX)</label>
                <input type="tel" value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} placeholder="254722XXXXXX" className="px-3 py-2 rounded border border-border text-sm font-mono bg-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
               <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Assigned Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="px-3 py-2 rounded border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="branch_manager">Branch Manager</option>
                  <option value="loan_officer">Loan Officer</option>
                </select>
              </div>
            </div>
               {inviteRole === "loan_officer" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Assigned Market Clusters (required)</label>
                <div className="flex flex-wrap gap-1.5">
                  {allMarkets.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleInviteMarket(m)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                        inviteMarkets.includes(m) ? "bg-primary text-white border-primary" : "bg-surface text-ink-dim border-border hover:border-primary"
                      }`}
                           >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 rounded bg-ground border border-border">
              <p className="text-[11px] text-ink-muted leading-relaxed">
                An invitation will be sent to the work email. Staff must sign in using their corporate domain email. No public sign-up is available.
              </p>
            </div>
              <button
              onClick={() => setShowInvite(false)}
              disabled={!inviteValid}
              className={`w-full py-2.5 rounded text-sm font-semibold transition-colors ${
                !inviteValid ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              Send Invitation
            </button>
          </div>
        </div>
      )}