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
