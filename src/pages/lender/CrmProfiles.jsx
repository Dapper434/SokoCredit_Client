import { useState } from "react";
import { borrowers } from "../../data/mockLenderData";
import StatusBadge from "../../components/shared/StatusBadge";

export default function CrmProfiles() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(borrowers[0]?.id);
  const [activeTab, setActiveTab] = useState("kyc");

  const filtered = borrowers.filter((b) =>
    `${b.fullName} ${b.phone} ${b.id}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = borrowers.find((b) => b.id === selectedId) || borrowers[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">CRM & Profiles</h1>
      <p className="text-ink-dim mb-8">Thursday, 20 August 2026</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: search + borrower list */}
        <div className="lg:col-span-1">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search borrower..."
            className="w-full border border-border rounded-md px-4 py-2 mb-4 text-ink focus:outline-none focus:border-primary"
          />
          <div className="space-y-2">
            {filtered.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`w-full text-left border rounded-lg p-4 transition-colors ${
                  selected?.id === b.id
                    ? "border-primary bg-primary-light"
                    : "border-border bg-surface hover:bg-ground"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-ink">{b.displayName}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-xs text-ink-muted">
                  {b.market} · {b.stall}
                </p>
                {b.balance > 0 && (
                  <p className="text-xs text-status-overdue-text mt-1">
                    Balance: KES {b.balance.toLocaleString()}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: selected borrower detail */}
        {selected && (
          <div className="lg:col-span-2 bg-surface border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {selected.initials}
              </div>
              <div className="flex-1">
                <p className="font-bold text-ink text-lg">{selected.fullName}</p>
                <p className="text-sm text-ink-muted">
                  {selected.market} · Stall {selected.stall}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-6">
              {["kyc", "loanHistory", "auditLog", "scoreHistory"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-ink-muted hover:text-ink"
                  }`}
                >
                  {tab === "kyc" && "KYC"}
                  {tab === "loanHistory" && "Loan History"}
                  {tab === "auditLog" && "Audit Log"}
                  {tab === "scoreHistory" && "Score History"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "kyc" && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <Field label="Full Legal Name" value={selected.fullName} />
                  <Field label="National ID" value={selected.nationalId} />
                  <Field label="Gender" value={selected.gender} />
                  <Field label="Date of Birth" value={selected.dob} />
                  <Field label="M-Pesa Phone" value={selected.phone} />
                  <Field label="Market / Stall" value={`${selected.market} · ${selected.stall}`} />
                  <Field label="Monthly Turnover" value={selected.monthlyTurnover} />
                  <Field label="Next of Kin" value={selected.nextOfKin} />
                  <Field label="Address" value={selected.address} />
                </div>
              )}
              {activeTab === "loanHistory" && (
                <p className="text-ink-muted text-sm">
                  In-house score: {selected.inHouseScore ?? "—"}/100 · Tier {selected.tier}
                </p>
              )}
              {activeTab === "auditLog" && (
                <p className="text-ink-muted text-sm">No audit events recorded yet.</p>
              )}
              {activeTab === "scoreHistory" && (
                <p className="text-ink-muted text-sm">
                  Current tier: <StatusBadge tier={selected.tier} />
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase text-ink-muted tracking-wide mb-1">{label}</p>
      <p className="text-ink">{value || "—"}</p>
    </div>
  );
}