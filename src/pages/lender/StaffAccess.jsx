import { useState, useEffect } from "react";
import { changeRequests, changeableFields, allMarkets } from "../../data/mockLenderData";
import StatusBadge from "../../components/shared/StatusBadge";
import { getStaffMembers, addStaffMember, submitSettingChangeRequest, updateStaffStatus, submitStaffEditRequest } from "../../lib/api";
import { useToast } from "../../components/shared/Toast";

const STAFF_STATUS_STYLES = {
  active: "bg-status-paid-bg text-status-paid-text border-status-paid-border",
  suspended: "bg-status-overdue-bg text-status-overdue-text border-status-overdue-border",
  invited: "bg-status-due-bg text-status-due-text border-status-due-border",
};

const CHANGE_STATUS_LABELS = {
  pending: "Pending SokoCredit Review",
  approved: "Approved",
  rejected: "Rejected",
};

// Maps frontend field keys to backend SETTLEMENT_FIELDS column names
const FIELD_KEY_TO_COLUMN = {
  interest: "default_interest_rate",
  penalty: "default_penalty_rate",
  paybill: "collection_paybill_number",
  airtel: "airtel_paybill_number",
};

export default function StaffAccess() {
  const [showInvite, setShowInvite] = useState(false);
  const [showChangeReq, setShowChangeReq] = useState(null);
  
  const [showEditStaff, setShowEditStaff] = useState(null);
  const [editStaffFields, setEditStaffFields] = useState([]);
  const [editStaffReason, setEditStaffReason] = useState("");

  const [staffRoster, setStaffRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState("loan_officer");
  const [invitePassword, setInvitePassword] = useState("");
  const [showInvitePassword, setShowInvitePassword] = useState(false);
  const [inviteMarkets, setInviteMarkets] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);

  const [changeNewValue, setChangeNewValue] = useState("");
  const [changeReason, setChangeReason] = useState("");

  const { toast, ToastContainer } = useToast();

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaffMembers();
      setStaffRoster(data);
    } catch (err) {
      toast("Failed to load staff roster", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const toggleInviteMarket = (m) => {
    setInviteMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const specials = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let pwd = "";
    for (let i = 0; i < 10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    pwd += specials.charAt(Math.floor(Math.random() * specials.length));
    setInvitePassword(pwd);
    setShowInvitePassword(true);
  };

  const handleAddStaff = async () => {
    try {
      setSubmitting(true);
      await addStaffMember({
        email: inviteEmail.trim(),
        full_name: inviteName.trim(),
        phone_number: invitePhone.trim() || undefined,
        role: inviteRole,
        password: invitePassword,
      });
      toast("Staff member added successfully!", "success");
      setShowInvite(false);
      setInviteName("");
      setInviteEmail("");
      setInvitePhone("");
      setInvitePassword("");
      fetchStaff();
    } catch (err) {
      toast(err.message || "Failed to add staff member", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (staffId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await updateStaffStatus(staffId, newStatus);
      toast(`Successfully ${newStatus === "active" ? "reactivated" : "deactivated"}`, "success");
      fetchStaff();
    } catch (err) {
      toast(err.message || "Failed to update staff status", "error");
    }
  };

  const toggleEditStaffField = (f) => {
    setEditStaffFields((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const handleEditStaffSubmit = async () => {
    if (editStaffFields.length === 0 || !editStaffReason) return;
    try {
      setSubmitting(true);
      const res = await submitStaffEditRequest(showEditStaff.id, { fields: editStaffFields, reason: editStaffReason });
      toast(res.message || "SokoCredit Team will review the request and reach out to confirm.", "success");
      setShowEditStaff(null);
      setEditStaffFields([]);
      setEditStaffReason("");
    } catch (err) {
      toast(err.message || "Failed to submit edit request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = staffRoster.filter((s) => s.status === "active").length;
  const bmCount = staffRoster.filter((s) => s.role === "branch_manager").length;
  const loCount = staffRoster.filter((s) => s.role === "loan_officer").length;
  const marketCount = [...new Set(staffRoster.flatMap((s) => s.markets || []).filter((m) => m !== "All"))].length;

  const fieldForChange = changeableFields.find((f) => f.key === showChangeReq);
  
  // Password validation: minimum 8 characters and at least one special character
  const isPasswordValid = invitePassword.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(invitePassword);
  
  const inviteValid = inviteName && inviteEmail && isPasswordValid && !(inviteRole === "loan_officer" && inviteMarkets.length === 0);
  const changeValid = changeNewValue && changeReason;

  return (
    <div className="p-6 pt-24 md:pt-6 flex flex-col gap-6 max-w-[1100px]">
      <ToastContainer />
      {/* Header metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:mt-16 lg:mt-0">
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
        {loCount === 0 && (
          <div className="bg-status-missed-bg/10 border-b border-status-missed-border px-5 py-3 flex items-start gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-status-missed-text mt-0.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <div>
              <p className="text-sm font-bold text-status-missed-text">Add your first Loan Officer</p>
              <p className="text-[11px] text-status-missed-text/80 mt-0.5">
                Loan officers are assigned to market clusters and manage daily collections and field visits. Click "Add Staff Member" above to invite your first officer.
              </p>
            </div>
          </div>
        )}
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
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-sm text-ink-muted">Loading staff members...</td>
              </tr>
            ) : staffRoster.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-sm text-ink-muted">No staff members found.</td>
              </tr>
            ) : staffRoster.map((s) => (
              <tr key={s.id} className="border-t border-border-dim hover:bg-ground transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${
                        s.role === "branch_manager" ? "bg-primary" : "bg-ink-dim"
                      }`}
                          >
                      {s.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink">{s.full_name}</p>
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
                <td className="px-4 py-3 text-xs text-ink-dim font-mono">{s.markets ? s.markets.join(", ") : "—"}</td>
                <td className="px-4 py-3 text-sm font-mono font-semibold text-ink">{s.borrowers > 0 ? s.borrowers : "—"}</td>
                <td className="px-4 py-3 text-xs text-ink-muted font-mono">{s.last_login_at ? new Date(s.last_login_at).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 py-3">
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${STAFF_STATUS_STYLES[s.status] || STAFF_STATUS_STYLES.active}`}>
                    {s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {s.status === "invited" ? (
                      <button className="text-[10px] font-mono text-status-due-text hover:underline">Resend invite</button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowEditStaff(s);
                            setEditStaffFields([]);
                            setEditStaffReason("");
                          }}
                          className="text-[10px] font-mono text-ink-dim border border-border px-2 py-0.5 rounded hover:bg-ground"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeactivate(s.id, s.status)}
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
              <button onClick={() => setShowInvite(false)} className="text-ink-muted hover:text-ink">
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
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="e.g. first.last@bm.domain.com" className="px-3 py-2 rounded border border-border text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary" />
                <p className="text-[9px] text-ink-muted">Format: first.last@{'<bm|lo>'}.domain</p>
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
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Password</label>
                  <button type="button" onClick={generatePassword} className="text-[10px] font-semibold text-primary hover:underline">
                    Generate Unique Password
                  </button>
                </div>
                <div className="relative">
                  <input type={showInvitePassword ? "text" : "password"} value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} placeholder="Minimum of 8 chars, 1 special char" className={`w-full px-3 py-2 pr-10 rounded border ${invitePassword && !isPasswordValid ? 'border-status-overdue-border focus:ring-status-overdue-border' : 'border-border focus:ring-primary'} text-sm bg-surface focus:outline-none focus:ring-2`} />
                  <button
                    type="button"
                    onClick={() => setShowInvitePassword(!showInvitePassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink"
                  >
                    {showInvitePassword ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.28 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
                {invitePassword && !isPasswordValid && <p className="text-[10px] text-status-overdue-text">Must be at least 8 characters long and contain a special character.</p>}
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
              onClick={handleAddStaff}
              disabled={!inviteValid || submitting}
              className={`w-full py-2.5 rounded text-sm font-semibold transition-colors ${
                !inviteValid || submitting ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {submitting ? "Adding..." : "Send Invitation & Add"}
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
              onClick={async () => {
                try {
                  const backendField = FIELD_KEY_TO_COLUMN[showChangeReq] || showChangeReq;
                  await submitSettingChangeRequest({
                    field_name: backendField,
                    requested_value: changeNewValue.trim(),
                    reason: changeReason.trim(),
                  });
                  toast("Change request submitted for compliance review.", "success");
                  setShowChangeReq(null);
                } catch (err) {
                  toast(err.message || "Failed to submit change request", "error");
                }
              }}
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

      {/* Edit staff modal */}
      {showEditStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-ground">
              <div>
                <h3 className="font-bold text-ink">Request Staff Changes</h3>
                <p className="text-xs text-ink-muted mt-0.5">Editing {showEditStaff.full_name}</p>
              </div>
              <button onClick={() => setShowEditStaff(null)} className="text-ink-muted hover:text-ink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-5">
              <div className="bg-status-due-bg/50 border border-status-due-border rounded p-3 text-xs text-status-due-text">
                <p className="font-semibold mb-1">Notice</p>
                <p className="text-[11px] opacity-90">Changes to staff roles, access levels, or markets require review by the SokoCredit compliance team. Submitting this request will open a ticket.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-2">Fields to Change</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Role", "Markets", "Phone Number", "Email Address"].map((f) => (
                    <label key={f} className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${editStaffFields.includes(f) ? "border-primary bg-primary/5" : "border-border hover:bg-ground"}`}>
                      <input type="checkbox" className="accent-primary" checked={editStaffFields.includes(f)} onChange={() => toggleEditStaffField(f)} />
                      <span className="text-xs text-ink font-medium">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Reason for Change</label>
                <textarea
                  className="w-full bg-ground border border-border rounded px-3 py-2 text-sm text-ink outline-none focus:border-primary transition-colors resize-none"
                  rows="3"
                  placeholder="e.g. Needs access to Gikomba market..."
                  value={editStaffReason}
                  onChange={(e) => setEditStaffReason(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border bg-ground flex justify-end gap-3">
              <button onClick={() => setShowEditStaff(null)} className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors">
                Cancel
              </button>
              <button
                onClick={handleEditStaffSubmit}
                disabled={submitting || editStaffFields.length === 0 || !editStaffReason}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Submitting..." : "Submit Change Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}