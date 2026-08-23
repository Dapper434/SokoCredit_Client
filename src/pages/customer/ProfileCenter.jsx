import { useState } from "react";
import {
  borrowerProfile,
  badges,
  pointRedemptions,
  statementDownloads,
  uploadedDocuments,
} from "../../data/mockCustomerData";

function LockedField({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wide">{label}</label>
      <div className="flex items-center justify-between px-3 py-2.5 rounded border border-border bg-ground">
        <span className="text-sm text-ink-dim">{value}</span>
        <button className="text-[10px] text-primary font-semibold border border-status-paid-border bg-status-paid-bg px-2 py-0.5 rounded hover:opacity-80 transition-opacity whitespace-nowrap ml-2">
          Request Edit
        </button>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-ink-dim uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

export default function ProfileCenter() {
  const [tab, setTab] = useState("kyc");
  const [address, setAddress] = useState(borrowerProfile.address);
  const [kinName, setKinName] = useState(borrowerProfile.nextOfKinName);
  const [email, setEmail] = useState(borrowerProfile.email);

  const { sokoPoints, fullName, initials, market, stall, tier } = borrowerProfile;

  return (
    <div className="flex flex-col pb-8">
      {/* Profile header */}
      <div className="bg-primary px-5 pt-6 pb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold text-white">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{fullName}</p>
            <p className="text-sm text-white/70">
              {market} · Stall {stall}
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-status-paid-border" />
              <span className="text-[10px] font-mono text-white/80">Tier {tier} · Active borrower</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-ground -mt-5 rounded-t-[20px]">
        <div className="flex border-b border-border px-5">
          {["kyc", "badges", "documents"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                tab === t ? "text-primary border-b-2 border-primary -mb-px" : "text-ink-muted hover:text-ink-dim"
              }`}
            >
              {t === "kyc" ? "KYC" : t === "badges" ? "Badges" : "Documents"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 pt-5 flex flex-col gap-4">
        {tab === "kyc" && (
          <>
            <div>
              <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-3">
                Locked Fields — require verification to change
              </p>
              <div className="flex flex-col gap-3">
                <LockedField label="Full Legal Name" value={borrowerProfile.fullName} />
                <LockedField label="National ID" value={borrowerProfile.nationalId} />
                <LockedField label="Gender" value={borrowerProfile.gender} />
                <LockedField label="M-Pesa Phone" value={borrowerProfile.phone} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-ink-dim uppercase tracking-widest mb-3">Editable Fields</p>
              <div className="flex flex-col gap-3">
                <EditableField label="Residential Address" value={address} onChange={setAddress} />
                <EditableField label="Next of Kin Name" value={kinName} onChange={setKinName} />
                <EditableField label="Email Address" value={email} onChange={setEmail} />
              </div>
            </div>
            <button className="w-full py-3 rounded bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors">
              Save Changes
            </button>
          </>
        )}

        {tab === "badges" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide">SokoPoints Balance</p>
                <p className="text-2xl font-bold font-mono text-accent mt-0.5">{sokoPoints} pts</p>
              </div>
              <button className="text-xs text-primary font-semibold border border-status-paid-border bg-status-paid-bg px-3 py-1.5 rounded hover:opacity-80 transition-opacity">
                Redeem Points
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center text-center py-4 px-2 rounded border transition-colors ${
                    badge.earned ? "bg-surface border-status-paid-border shadow-sm" : "bg-ground border-border opacity-50"
                  }`}
                >
                  <span className={`text-2xl mb-2 ${!badge.earned ? "grayscale" : ""}`}>{badge.icon}</span>
                  <p className="text-[10px] font-semibold text-ink leading-tight">{badge.name}</p>
                  <p className="text-[9px] font-mono text-ink-muted mt-1">+{badge.pts} pts</p>
                  {!badge.earned && <span className="text-[9px] font-mono text-ink-muted mt-1">Locked</span>}
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-3">Redeem SokoPoints</p>
              <div className="flex flex-col gap-2">
                {pointRedemptions.map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-3 px-3 bg-surface border border-border rounded">
                    <span className="text-sm text-ink">{r.label}</span>
                    <button
                      disabled={r.cost > sokoPoints}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded border transition-colors ${
                        r.cost === 0
                          ? "bg-status-paid-bg text-status-paid-text border-status-paid-border"
                          : r.cost > sokoPoints
                          ? "bg-ground text-ink-muted border-border cursor-not-allowed"
                          : "bg-primary text-white border-primary hover:bg-primary-hover"
                      }`}
                    >
                      {r.cost === 0 ? "Free" : `${r.cost} pts`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "documents" && (
          <>
            <p className="text-[11px] text-ink-muted mb-1">Tap to download. Documents generated instantly.</p>
            {statementDownloads.map(({ label, sub, icon }) => (
              <button
                key={label}
                className="flex items-center gap-4 w-full text-left py-4 px-4 bg-surface border border-border rounded hover:bg-ground transition-colors"
              >
                <span className="text-2xl">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="text-[11px] text-ink-muted">{sub}</p>
                </div>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary flex-shrink-0">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ))}

            <div>
              <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-3">Uploaded Documents</p>
              {uploadedDocuments.map((doc) => (
                <div key={doc.type} className="flex items-center justify-between py-2.5 border-b border-border-dim last:border-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{doc.type}</p>
                    <p className="text-[11px] font-mono text-ink-muted">{doc.date}</p>
                  </div>
                  <span className="text-[10px] font-mono text-status-paid-text bg-status-paid-bg border border-status-paid-border px-2 py-0.5 rounded">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}