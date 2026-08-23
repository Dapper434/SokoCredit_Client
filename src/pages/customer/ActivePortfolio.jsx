import { useState } from "react";
import StatusBadge from "../../components/shared/StatusBadge";
import {
  repaymentSchedule,
  portfolioSummary,
  arrearsBanners,
  extensionReasons,
  extensionTerms,
} from "../../data/mockCustomerData";

function kes(n) {
  return n === 0 ? "—" : n.toLocaleString("en-KE");
}

export default function ActivePortfolio() {
  const [arrearsState, setArrearsState] = useState("missed");
  const [showExtend, setShowExtend] = useState(false);

  const banner = arrearsBanners[arrearsState];
  const { outstandingBalance, percentRepaid, nextInstallment, dueInDays, maturityDate } = portfolioSummary;

  const bannerStyles = {
    due: "bg-status-due-bg border-status-due-border text-status-due-text",
    missed: "bg-status-missed-bg border-status-missed-border text-status-missed-text",
    overdue: "bg-status-overdue-bg border-status-overdue-border text-status-overdue-text",
  };

  return (
    <div className="flex flex-col gap-0 pb-8">
      {/* Outstanding balance hero */}
      <div className="bg-ink px-5 pt-5 pb-6 mx-5 mt-5 rounded-md">
        <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">Outstanding Balance</p>
        <p className="text-4xl font-bold font-mono text-white tracking-tight">KES {outstandingBalance.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${percentRepaid}%` }} />
          </div>
          <span className="text-[11px] text-white/50 font-mono">{percentRepaid}% repaid</span>
        </div>
      </div>

      {/* Next installment */}
      <div className="mx-5 mt-4 flex gap-3">
        <div className="flex-1 bg-surface border border-border rounded p-3">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wide mb-1">Next Installment</p>
          <p className="text-lg font-bold font-mono text-ink">KES {nextInstallment}</p>
        </div>
        <div className="flex-1 bg-surface border border-border rounded p-3">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wide mb-1">Due In</p>
          <p className="text-lg font-bold font-mono text-status-missed-text">{dueInDays} days</p>
        </div>
        <div className="flex-1 bg-surface border border-border rounded p-3">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wide mb-1">Maturity</p>
          <p className="text-lg font-bold font-mono text-ink">{maturityDate}</p>
        </div>
      </div>

      {/* State switcher (demo only) */}
      <div className="mx-5 mt-4 flex items-center gap-1.5">
        <span className="text-[10px] text-ink-muted font-mono uppercase tracking-wide mr-1">Demo state:</span>
        {["none", "due", "missed", "overdue"].map((s) => (
          <button
            key={s}
            onClick={() => setArrearsState(s)}
            className={`px-2 py-0.5 text-[10px] rounded font-mono border transition-colors ${
              arrearsState === s ? "bg-ink text-white border-ink" : "bg-surface border-border text-ink-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Arrears banner */}
      {banner && (
        <div className={`mx-5 mt-3 rounded border px-4 py-3 ${bannerStyles[arrearsState]}`}>
          <p className="text-xs font-bold uppercase tracking-wide">{banner.label}</p>
          <p className="text-xs mt-1 leading-relaxed">{banner.message}</p>
        </div>
      )}

      {/* Lipa na M-Pesa button */}
      <div className="mx-5 mt-4">
        <button className="w-full py-4 rounded bg-status-paid-text text-white font-bold text-sm flex items-center justify-center gap-2.5 hover:opacity-90 active:scale-[0.99] transition-all">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
          Lipa na M-Pesa
          <span className="text-xs font-mono text-white/70 font-normal">STK Push</span>
        </button>
      </div>

      {/* Amortization table */}
      <div className="mx-5 mt-5">
        <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-3">Repayment Schedule</p>
        <div className="bg-surface border border-border rounded overflow-hidden">
          <div className="grid grid-cols-[24px_1fr_auto_auto_auto] gap-2 px-3 py-2 bg-ground border-b border-border">
            <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase">#</span>
            <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase">Date</span>
            <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase text-right">Expected</span>
            <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase text-right">Paid</span>
            <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase text-right">Status</span>
          </div>
          {repaymentSchedule.map((row) => (
            <div
              key={row.no}
              className={`grid grid-cols-[24px_1fr_auto_auto_auto] gap-2 px-3 py-2.5 border-b border-border-dim last:border-0 ${
                row.status === "overdue" ? "bg-status-overdue-bg/40" : row.status === "missed" ? "bg-status-missed-bg/40" : ""
              }`}
            >
              <span className="text-[11px] font-mono text-ink-muted">{row.no}</span>
              <span className="text-[11px] text-ink-dim">{row.date}</span>
              <span className="text-[11px] font-mono text-ink text-right">{kes(row.expected)}</span>
              <span className={`text-[11px] font-mono text-right ${row.paid > 0 ? "text-status-paid-text" : "text-ink-muted"}`}>
                {kes(row.paid)}
              </span>
              <div className="flex justify-end">
                <StatusBadge status={row.status} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-ink-muted font-mono mt-2">Channel key: M-Pesa · KCB Buni · Cash</p>
      </div>

      {/* Request time extension */}
      {!showExtend ? (
        <div className="mx-5 mt-4 mb-6">
          <button
            onClick={() => setShowExtend(true)}
            className="w-full py-3 rounded border border-border bg-surface text-sm font-semibold text-ink-dim hover:bg-ground transition-colors"
          >
            Request Time Extension
          </button>
          <p className="text-[11px] text-ink-muted text-center mt-1.5">Available if loan is approaching maturity without default</p>
        </div>
      ) : (
        <div className="mx-5 mt-4 mb-6 bg-surface border border-border rounded p-4">
          <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-3">Extension Request</p>
          <div className="flex flex-col gap-3">
            <select className="w-full px-3 py-2.5 rounded border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Reason</option>
              {extensionReasons.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select className="w-full px-3 py-2.5 rounded border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Requested terms</option>
              {extensionTerms.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button className="w-full py-3 rounded bg-primary text-white font-semibold text-sm hover:bg-primary-hover">
              Submit for Approval
            </button>
          </div>
        </div>
      )}
    </div>
  );
}