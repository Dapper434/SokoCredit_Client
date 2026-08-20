import { useState } from "react";
import { borrowers } from "../../data/mockLenderData";
import StatusBadge from "../../components/shared/StatusBadge";

const TABS = { kyc: "KYC", loanHistory: "Loan History", auditLog: "Audit Log", scoreHistory: "Score History" };
const Field = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase text-ink-muted tracking-wide mb-1">{label}</p>
    <p className="text-ink">{value || "—"}</p>
  </div>
);

export default function CrmProfiles() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(borrowers[0]?.id);
  const [activeTab, setActiveTab] = useState("kyc");
  const q = search.toLowerCase();
  const filtered = borrowers.filter((b) => `${b.fullName} ${b.phone} ${b.id}`.toLowerCase().includes(q));
  const selected = borrowers.find((b) => b.id === selectedId) || borrowers[0];
  const kyc = selected ? [
    ["Full Legal Name", selected.fullName], ["National ID", selected.nationalId], ["Gender", selected.gender],
    ["Date of Birth", selected.dob], ["M-Pesa Phone", selected.phone], ["Market / Stall", `${selected.market} · ${selected.stall}`],
    ["Monthly Turnover", selected.monthlyTurnover], ["Next of Kin", selected.nextOfKin], ["Address", selected.address],
  ] : [];
