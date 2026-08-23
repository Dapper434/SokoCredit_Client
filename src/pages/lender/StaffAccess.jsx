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