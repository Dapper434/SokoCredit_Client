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
      <div className="grid grid-cols-4 gap-3"></div>
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
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-ground"></div>
          <h2 className="text-sm font-bold text-ink">Staff Roster</h2>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
          ></button>
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