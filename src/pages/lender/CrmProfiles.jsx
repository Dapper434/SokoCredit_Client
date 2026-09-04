import { useState, useEffect } from "react";
import { getCustomers } from "../../lib/api";
import StatusBadge from "../../components/shared/StatusBadge";

export default function CrmProfiles() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasData = borrowers.length > 0;
  const [search, setSearch] = useState("");
  const [marketFilter, setMarketFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("kyc");

  useEffect(() => {
    getCustomers().then((data) => {
      setBorrowers(data);
      if (data.length > 0) setSelectedId(data[0].id);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const markets = ["All", ...new Set(borrowers.map((b) => b.market))];
  const tiers = ["All", "A", "B", "C"];

  const filtered = borrowers.filter((b) => {
    const matchesSearch = `${b.fullName} ${b.phone} ${b.id}`.toLowerCase().includes(search.toLowerCase());
    const matchesMarket = marketFilter === "All" || b.market === marketFilter;
    const matchesTier = tierFilter === "All" || b.tier === tierFilter;
    return matchesSearch && matchesMarket && matchesTier;
  });

  const selected = borrowers.find((b) => b.id === selectedId) || borrowers[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">CRM & Profiles</h1>
      <p className="text-ink-dim mb-8">Thursday, 20 August 2026</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: search + borrower list */}
        <div className="lg:col-span-1 border-r lg:border-border lg:pr-6 border-b lg:border-b-0 pb-6 lg:pb-0">
          <input
            type="search"
            value={search}
            disabled={!hasData}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search borrower..."
            className="w-full border border-border rounded-md px-4 py-2 mb-4 text-ink focus:outline-none focus:border-primary disabled:opacity-50"
          />
          <div className="flex gap-2 mb-4">
             <select 
               value={marketFilter}
               onChange={(e) => setMarketFilter(e.target.value)}
               disabled={!hasData} 
               className="flex-1 border border-border rounded-md px-2 py-1 text-xs text-ink bg-surface focus:outline-none focus:border-primary disabled:opacity-50"
             >
                {markets.map(m => (
                  <option key={m} value={m}>{m === "All" ? "All markets" : m}</option>
                ))}
             </select>
             <select 
               value={tierFilter}
               onChange={(e) => setTierFilter(e.target.value)}
               disabled={!hasData} 
               className="w-20 border border-border rounded-md px-2 py-1 text-xs text-ink bg-surface focus:outline-none focus:border-primary disabled:opacity-50"
             >
                {tiers.map(t => (
                  <option key={t} value={t}>{t === "All" ? "Tier" : `Tier ${t}`}</option>
                ))}
             </select>
          </div>
          <div className="space-y-2">
            {loading ? (
              <p className="text-center text-ink-muted text-sm py-8">Loading profiles...</p>
            ) : !hasData ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-12 h-12 rounded-full border border-dashed border-border-dim flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-ink-muted opacity-50">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-ink mb-1">No borrowers enrolled</h3>
                <p className="text-[10px] text-ink-muted leading-relaxed">
                  Borrowers appear here once they create accounts and complete onboarding through the SokoCredit app.
                </p>
              </div>
            ) : (
              filtered.map((b) => (
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
              ))
            )}
          </div>
        </div>

        {/* Right: selected borrower detail */}
        {hasData && selected ? (
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
                  <Field label="Next of Kin" value={`${selected.nextOfKin} (${selected.nextOfKinEmail})`} />
                  <Field label="Residential Address" value={selected.address} />
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
        ) : (
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-16 h-16 rounded-full border border-dashed border-border-dim flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ink-muted opacity-50">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-ink mb-2">No borrower profiles yet</h3>
            <p className="text-[11px] text-ink-muted max-w-sm mx-auto leading-relaxed">
              Customer 360° profiles — KYC details, loan history, credit score timeline, and audit trail — will appear here once your first borrowers enroll.
            </p>
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