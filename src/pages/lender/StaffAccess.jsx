import { useState, useEffect } from "react";
import { changeableFields, allMarkets } from "../../data/mockLenderData";
import StatusBadge from "../../components/shared/StatusBadge";
import { useToast } from "../../components/shared/Toast";

// localStorage keys
const STAFF_KEY = "sokocredit_staff_roster";
const CHANGE_REQ_KEY = "sokocredit_change_requests";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const STAFF_STATUS_STYLES = {
  active: "bg-status-paid-bg text-status-paid-text border-status-paid-border",
  inactive: "bg-status-overdue-bg text-status-overdue-text border-status-overdue-border",
  invited: "bg-status-due-bg text-status-due-text border-status-due-border",
};

export default function StaffAccess() {
  const { toast, ToastContainer } = useToast();

  // ── Staff roster state (persisted to localStorage) ──
  const [roster, setRoster] = useState(() => loadFromStorage(STAFF_KEY, []));
  const [showInvite, setShowInvite] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // null = adding, object = editing

  // ── Invite / edit form fields ──
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState("loan_officer");
  const [inviteMarkets, setInviteMarkets] = useState([]);

  // ── Change request state (persisted to localStorage) ──
  const [changeReqs, setChangeReqs] = useState(() => loadFromStorage(CHANGE_REQ_KEY, []));
  const [showChangeReq, setShowChangeReq] = useState(null);
  const [changeNewValue, setChangeNewValue] = useState("");
  const [changeReason, setChangeReason] = useState("");

  // Persist roster whenever it changes
  useEffect(() => {
    saveToStorage(STAFF_KEY, roster);
  }, [roster]);

  // Persist change requests whenever they change
  useEffect(() => {
    saveToStorage(CHANGE_REQ_KEY, changeReqs);
  }, [changeReqs]);

  // ── Derived metrics ──
  const activeCount = roster.filter((s) => s.status === "active").length;
  const bmCount = roster.filter((s) => s.role === "branch_manager").length;
  const loCount = roster.filter((s) => s.role === "loan_officer").length;
  const marketCount = [...new Set(roster.flatMap((s) => s.markets).filter((m) => m !== "All"))].length;

  // ── Form helpers ──
  const toggleInviteMarket = (m) => {
    setInviteMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const resetInviteForm = () => {
    setInviteName("");
    setInviteEmail("");
    setInvitePhone("");
    setInvitePassword("");
    setInviteRole("loan_officer");
    setInviteMarkets([]);
    setEditingStaff(null);
  };

  const openAddModal = () => {
    resetInviteForm();
    setShowInvite(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setInviteName(staff.name);
    setInviteEmail(staff.email);
    setInvitePhone(staff.phone);
    setInviteRole(staff.role);
    setInviteMarkets(staff.markets.includes("All") ? [] : [...staff.markets]);
    setShowInvite(true);
  };

  const closeInviteModal = () => {
    setShowInvite(false);
    resetInviteForm();
  };

  const inviteValid = inviteName && inviteEmail && !(inviteRole === "loan_officer" && inviteMarkets.length === 0) && (editingStaff || invitePassword.length >= 8);

  // ── Add or update a staff member ──
  const handleSubmitStaff = () => {
    if (!inviteValid) return;

    if (editingStaff) {
      // Update existing staff
      setRoster((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id
            ? {
                ...s,
                name: inviteName.trim(),
                email: inviteEmail.trim(),
                phone: invitePhone.trim(),
                role: inviteRole,
                markets: inviteRole === "branch_manager" ? ["All"] : [...inviteMarkets],
              }
            : s
        )
      );
      toast("Staff member updated successfully");
    } else {
      // Add new staff
      const maxId = roster.reduce((max, s) => Math.max(max, s.id || 0), 0);
      const newStaff = {
        id: maxId + 1,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        phone: invitePhone.trim(),
        password: invitePassword,
        role: inviteRole,
        markets: inviteRole === "branch_manager" ? ["All"] : [...inviteMarkets],
        borrowers: 0,
        lastActive: "Never",
        status: "invited",
      };
      setRoster((prev) => [...prev, newStaff]);
      toast("Invitation sent to " + inviteEmail.trim());
    }

    closeInviteModal();
  };

  // ── Toggle active/inactive ──
  const handleToggleStatus = (staffId) => {
    setRoster((prev) =>
      prev.map((s) => {
        if (s.id !== staffId) return s;
        const newStatus = s.status === "active" ? "inactive" : "active";
        return { ...s, status: newStatus };
      })
    );
    const staff = roster.find((s) => s.id === staffId);
    const action = staff?.status === "active" ? "deactivated" : "reactivated";
    toast(`${staff?.name} has been ${action}`);
  };

  // ── Change request ──
  const fieldForChange = changeableFields.find((f) => f.key === showChangeReq);
  const changeValid = changeNewValue && changeReason;

  const handleSubmitChange = () => {
    if (!changeValid || !fieldForChange) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const seqNum = String(changeReqs.length + 1).padStart(3, "0");

    const newReq = {
      id: `CR-${today.getFullYear()}-${seqNum}`,
      field: fieldForChange.label,
      oldValue: fieldForChange.current,
      newValue: changeNewValue.trim(),
      reason: changeReason.trim(),
      status: "pending",
      date: dateStr,
    };

    setChangeReqs((prev) => [...prev, newReq]);
    toast("Change request submitted for review");
    setShowChangeReq(null);
    setChangeNewValue("");
    setChangeReason("");
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1100px]">
      <ToastContainer />

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
            onClick={openAddModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Staff Member
          </button>
        </div>

        {roster.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-ink-muted text-sm mb-1">No staff members yet</p>
            <p className="text-ink-dim text-xs">Click "Add Staff Member" to invite your first team member.</p>
          </div>
        ) : (
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
              {roster.map((s) => (
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
                          <button
                            onClick={() => openEditModal(s)}
                            className="text-[10px] font-mono text-ink-dim border border-border px-2 py-0.5 rounded hover:bg-ground"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(s.id)}
                            className="text-[10px] font-mono text-status-overdue-text hover:underline"
                          >
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
        )}
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
          {changeReqs.length === 0 ? (
            <p className="text-sm text-ink-muted py-4 text-center">No change requests submitted yet.</p>
          ) : (
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
                {changeReqs.map((cr) => (
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
          )}
        </div>
      </div>

       {/* Invite / Edit staff modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={closeInviteModal}>
          <div className="bg-surface rounded border border-border w-full max-w-md p-5 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</h3>
              <button onClick={closeInviteModal} className="text-ink-muted hover:text-ink">
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
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="e.g. alice@company.com" className="px-3 py-2 rounded border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary" disabled={!!editingStaff} />
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

            {/* Password field — only shown when adding new staff */}
            {!editingStaff && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Initial Password (min 8 chars)</label>
                <input type="password" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} placeholder="Minimum 8 characters" minLength={8} className="px-3 py-2 rounded border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            )}

            <div className="p-3 rounded bg-ground border border-border">
              <p className="text-[11px] text-ink-muted leading-relaxed">
                {editingStaff
                  ? "Changes will be saved immediately. The staff member's login credentials remain unchanged."
                  : "An invitation will be sent to the work email. Staff must sign in using their corporate domain email. No public sign-up is available."}
              </p>
            </div>
              <button
              onClick={handleSubmitStaff}
              disabled={!inviteValid}
              className={`w-full py-2.5 rounded text-sm font-semibold transition-colors ${
                !inviteValid ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {editingStaff ? "Save Changes" : "Send Invitation"}
            </button>
          </div>
        </div>
      )}

       {/* Change request modal */}
      {showChangeReq && fieldForChange && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={() => setShowChangeReq(null)}>
          <div className="bg-surface rounded border border-border w-full max-w-sm p-5 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">Request Change</h3>
              <button onClick={() => setShowChangeReq(null)} className="text-ink-muted hover:text-ink">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
             <div className="flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-1">Field</p>
                <p className="text-sm font-semibold text-ink">{fieldForChange.label}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-1">Current Value</p>
                <p className="text-sm font-mono text-ink-dim">{fieldForChange.current}</p>
                   </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Requested New Value</label>
                <input type="text" value={changeNewValue} onChange={(e) => setChangeNewValue(e.target.value)} placeholder="Enter new value" className="px-3 py-2 rounded border border-border text-sm font-mono bg-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
                <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Reason for Change</label>
                <textarea value={changeReason} onChange={(e) => setChangeReason(e.target.value)} placeholder="Explain why this change is needed..." rows={3} className="px-3 py-2 rounded border border-border text-sm bg-surface resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
                <div className="p-3 rounded bg-status-due-bg border border-status-due-border">
              <p className="text-[11px] text-status-due-text leading-relaxed">
                This request will show as <strong>Pending SokoCredit Review</strong> until approved. Changes only take effect after SokoCredit compliance approves them.
              </p>
            </div>
<button
              onClick={handleSubmitChange}
              disabled={!changeValid}
              className={`w-full py-2.5 rounded text-sm font-semibold transition-colors ${
                !changeValid ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              Submit Change Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}