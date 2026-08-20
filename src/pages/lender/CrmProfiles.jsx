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
