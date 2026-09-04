import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/shared/StatusBadge";
import {
  getMyLoans, getCustomerSchedule, getCheckins,
  initiateRepaymentStk, getTransactionStatus, simulateMpesaCallback,
} from "../../lib/api";
import { arrearsBanners, extensionReasons, extensionTerms, repaymentSchedule as mockSchedule } from "../../data/mockCustomerData";

function kes(n) {
  return n === 0 ? "—" : Number(n).toLocaleString("en-KE");
}

export default function ActivePortfolio() {
  const navigate = useNavigate();
  const [arrearsState, setArrearsState] = useState("none");
  const [showExtend, setShowExtend] = useState(false);
  const [loan, setLoan] = useState(null);
  const [latest, setLatest] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payStatus, setPayStatus] = useState(null); // null | "waiting" | "done" | "failed"
  const [payError, setPayError] = useState(null);
  const [pendingCrid, setPendingCrid] = useState(null);
  const [gateComplete, setGateComplete] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const checkins = await getCheckins().catch(() => null);
        if (checkins && checkins.gate_complete) {
          setGateComplete(true);
        }

        const loans = await getMyLoans();
        // Newest first (id desc). Surface the latest outcome even if it was a
        // rejection, but only load a schedule for a real disbursed loan.
        const newest = loans && loans.length > 0 ? loans[0] : null;
        setLatest(newest);

        const servicedLoan = (loans || []).find((l) => l.status !== "rejected") || null;
        if (servicedLoan) {
          setLoan(servicedLoan);
          const sched = await getCustomerSchedule(servicedLoan.id);
          setSchedule(sched);

          if (servicedLoan.status === "overdue") setArrearsState("overdue");
          else if (sched.some((s) => s.status === "missed" || s.status === "overdue")) setArrearsState("missed");
          else setArrearsState("none");
        } else {
          setLoan(null);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err.message);
        setLoan(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Poll a pending STK transaction until Safaricom's callback resolves it.
  const pollTransaction = async (crid) => {
    for (let i = 0; i < 20; i++) {                 // ~60s at 3s
      await new Promise((r) => setTimeout(r, 3000));
      let t;
      try {
        t = await getTransactionStatus(crid);
      } catch {
        continue;
      }
      if (t.status === "completed") {
        setPayStatus("done");
        const sched = await getCustomerSchedule(loan.id);
        setSchedule(sched);
        setTimeout(() => { setPayStatus(null); setPendingCrid(null); }, 4000);
        return;
      }
      if (t.status === "failed") {
        setPayStatus("failed");
        setPayError(t.failure_reason || "M-Pesa payment failed.");
        setTimeout(() => { setPayStatus(null); setPendingCrid(null); }, 5000);
        return;
      }
    }
    setPayStatus("failed");
    setPayError("Timed out waiting for M-Pesa confirmation.");
  };

  const handleRepay = async () => {
    if (!loan) return;
    setPaying(true);
    setPayError(null);
    try {
      const { checkout_request_id } = await initiateRepaymentStk(loan.id);
      setPendingCrid(checkout_request_id);
      setPayStatus("waiting");
      pollTransaction(checkout_request_id);       // fire-and-forget; UI updates via state
    } catch (err) {
      setPayError(err.message);
      setPayStatus("failed");
    } finally {
      setPaying(false);
    }
  };

  // Dev-only: stand in for Safaricom's callback when there's no public tunnel.
  const handleSimulate = async () => {
    if (!pendingCrid) return;
    try {
      await simulateMpesaCallback(pendingCrid);
    } catch (err) {
      setPayError(err.message);
    }
  };

  if (loading) return <div className="p-5 text-center text-ink-muted">Loading portfolio...</div>;
  if (error) return <div className="p-5 text-center text-status-missed-text">{error}</div>;
  
  if (!loan) {
    return (
      <div className="pb-24 md:pb-12 md:max-w-2xl md:mx-auto md:px-8 md:pt-8 min-h-[80vh] flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center px-5">
          {(latest?.status === "rejected" || latest?.approval_decision === "rejected") && (
            <div className="w-full mb-8 rounded-md md:rounded-xl border border-status-missed-border bg-status-missed-bg p-4 md:p-5 text-left shadow-sm">
              <p className="text-sm font-bold text-status-missed-text mb-1">
                Last loan request not approved
              </p>
              <p className="text-xs md:text-sm text-status-missed-text/90 leading-relaxed">
                Your request for KES {Number(latest.principal).toLocaleString()} was not approved
                {latest.approval_notes ? `: "${latest.approval_notes}"` : "."}
              </p>
              <p className="text-xs md:text-sm text-ink-dim leading-relaxed mt-2">
                Keep saving to grow your credit tier and raise your limit, or speak to a loan
                officer for a manual review.
              </p>
            </div>
          )}
          {/* Skeleton Icon */}
          <div className="w-16 h-12 border border-dashed border-border-dim rounded-md flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-ink-muted/50" strokeWidth="1.5">
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M3 10h18" />
              <path d="M7 14h3" />
            </svg>
          </div>
          
          <h2 className="text-lg font-bold font-mono text-ink mb-2">No active loan</h2>
          <p className="text-xs text-ink-muted text-center max-w-sm mb-8 leading-relaxed">
            Once your first loan is approved and disbursed, your repayment schedule, outstanding balance, and payment history will appear here.
          </p>

          {/* Skeleton Hero Card */}
          <div className="w-full bg-surface border border-border rounded-md md:rounded-xl shadow-sm mb-6 overflow-hidden">
            {/* Top dark half */}
            <div className="px-5 pt-4 pb-8 bg-[#9E9A94]/60 flex flex-col justify-center items-center">
              <p className="text-[10px] font-mono font-medium text-white/70 uppercase tracking-widest mb-3">
                Outstanding Balance
              </p>
              <div className="h-6 w-32 bg-white/20 rounded self-start ml-2"></div>
            </div>
            {/* Bottom white half */}
            <div className="p-4 bg-white flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-ground-dim rounded-md"></div>
                <div className="h-12 bg-ground-dim rounded-md"></div>
                <div className="h-12 bg-ground-dim rounded-md"></div>
              </div>
              <div className="h-10 bg-status-paid-bg/40 rounded-md w-full"></div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/customer/loan')}
            className="w-full py-4 rounded font-semibold text-sm flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover active:scale-[0.99] transition-all shadow-sm"
          >
            Apply for Your First Loan
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {!gateComplete && (
            <p className="text-[11px] font-mono text-ink-muted mt-3">
              Complete 14-day savings gate first
            </p>
          )}
        </div>
      </div>
    );
  }

  const banner = arrearsBanners[arrearsState];
  
  // Calculate summary stats
  const totalExpected = schedule.reduce((sum, row) => sum + Number(row.total_due), 0);
  const totalPaid = schedule.reduce((sum, row) => sum + Number(row.amount_paid), 0);
  const outstandingBalance = totalExpected - totalPaid;
  const percentRepaid = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;
  
  const pendingInstallments = schedule.filter(s => s.status === "pending" || s.status === "overdue" || s.status === "partial");
  const nextInstallment = pendingInstallments.length > 0 ? pendingInstallments[0].total_due - pendingInstallments[0].amount_paid : 0;
  const nextDate = pendingInstallments.length > 0 ? new Date(pendingInstallments[0].due_date).toLocaleDateString() : "—";

  const bannerStyles = {
    due: "bg-status-due-bg border-status-due-border text-status-due-text",
    missed: "bg-status-missed-bg border-status-missed-border text-status-missed-text",
    overdue: "bg-status-overdue-bg border-status-overdue-border text-status-overdue-text",
    none: "hidden"
  };

  return (
    <div className="flex flex-col gap-0 pb-8 md:max-w-6xl md:mx-auto md:px-8 md:pt-8 md:pb-12 min-h-screen">
      
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">Active Portfolio</h1>
          <p className="text-sm text-ink-muted">Manage your current loan and track repayments</p>
        </div>
        <button
          onClick={handleRepay}
          disabled={paying || payStatus === "waiting"}
          className="px-6 py-2.5 rounded bg-status-paid-text text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
          {payStatus === "waiting" ? "Waiting for M-Pesa…" : paying ? "Processing…" : "Lipa na M-Pesa"}
        </button>
      </div>

      <div className="md:grid md:grid-cols-4 md:gap-6 md:mb-8">
        {/* Outstanding balance hero */}
        <div className="bg-ink px-5 pt-5 pb-6 mx-5 mt-5 md:mx-0 md:mt-0 rounded-md md:col-span-1 flex flex-col justify-center">
          <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">Outstanding Balance</p>
          <p className="text-4xl font-bold font-mono text-white tracking-tight">KES {outstandingBalance.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${percentRepaid}%` }} />
            </div>
            <span className="text-[11px] text-white/50 font-mono">{percentRepaid}% repaid</span>
          </div>
        </div>

        {/* Next installment metrics */}
        <div className="mx-5 mt-4 md:mx-0 md:mt-0 flex gap-3 md:col-span-3 md:gap-6">
          <div className="flex-1 bg-surface border border-border rounded p-3 md:p-6 flex flex-col justify-center">
            <p className="text-[10px] md:text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1 md:mb-2">Next Installment</p>
            <p className="text-lg md:text-2xl font-bold font-mono text-ink">KES {nextInstallment.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-surface border border-border rounded p-3 md:p-6 flex flex-col justify-center">
            <p className="text-[10px] md:text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1 md:mb-2">Due Date</p>
            <p className="text-lg md:text-2xl font-bold font-mono text-status-missed-text">{nextDate}</p>
          </div>
          <div className="flex-1 bg-surface border border-border rounded p-3 md:p-6 flex flex-col justify-center">
            <p className="text-[10px] md:text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1 md:mb-2">Status</p>
            <p className="text-lg md:text-2xl font-bold font-mono text-ink uppercase text-[12px] md:text-base mt-1 md:mt-0">{loan.status}</p>
          </div>
        </div>
      </div>

      {/* M-Pesa STK status */}
      {payStatus && (
        <div className={`mx-5 mt-3 md:mx-0 md:mb-4 rounded border px-4 py-3 text-sm ${
          payStatus === "done"
            ? "bg-status-paid-bg border-status-paid-border text-status-paid-text"
            : payStatus === "failed"
            ? "bg-status-missed-bg border-status-missed-border text-status-missed-text"
            : "bg-status-due-bg border-status-due-border text-status-due-text"
        }`}>
          {payStatus === "waiting" && (
            <>
              <span className="font-semibold">STK push sent.</span> Waiting for M-Pesa to confirm your payment…
              {import.meta.env.DEV && (
                <button onClick={handleSimulate} className="ml-3 underline font-semibold">
                  Simulate confirmation (dev)
                </button>
              )}
            </>
          )}
          {payStatus === "done" && <span className="font-semibold">Payment confirmed — schedule updated.</span>}
          {payStatus === "failed" && <span className="font-semibold">{payError || "Payment failed."}</span>}
        </div>
      )}

      {/* Arrears banner */}
      {banner && arrearsState !== "none" && (
        <div className={`mx-5 mt-3 md:mx-0 md:-mt-4 md:mb-8 rounded border px-4 py-3 md:p-4 ${bannerStyles[arrearsState]}`}>
          <p className="text-xs md:text-sm font-bold uppercase tracking-wide">{banner.label}</p>
          <p className="text-xs md:text-sm mt-1 leading-relaxed">{banner.message}</p>
        </div>
      )}

      {/* Lipa na M-Pesa button (Mobile only, desktop is in header) */}
      <div className="mx-5 mt-4 md:hidden">
        <button 
          onClick={handleRepay}
          disabled={paying || payStatus === "waiting"}
          className="w-full py-4 rounded bg-status-paid-text text-white font-bold text-sm flex items-center justify-center gap-2.5 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
          {payStatus === "waiting" ? "Waiting for M-Pesa…" : paying ? "Processing…" : "Lipa na M-Pesa"}
          <span className="text-xs font-mono text-white/70 font-normal">STK Push</span>
        </button>
      </div>

      {/* Main Content Layout for Desktop */}
      <div className="md:grid md:grid-cols-[1fr_300px] md:gap-8 md:items-start">
        
        {/* Amortization table */}
        <div className="mx-5 mt-5 md:mx-0 md:mt-0">
          <p className="text-xs md:text-sm font-semibold text-ink-dim uppercase tracking-wide mb-3 md:mb-4">Repayment Schedule</p>
          
          {/* Mobile Stacked Rows */}
          <div className="md:hidden bg-surface border border-border rounded overflow-hidden">
            <div className="grid grid-cols-[24px_1fr_auto_auto_auto] gap-2 px-3 py-2 bg-ground border-b border-border">
              <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase">#</span>
              <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase">Date</span>
              <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase text-right">Expected</span>
              <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase text-right">Paid</span>
              <span className="text-[9px] font-mono font-semibold text-ink-muted uppercase text-right">Status</span>
            </div>
            {schedule.map((row) => (
              <div
                key={row.id}
                className={`grid grid-cols-[24px_1fr_auto_auto_auto] gap-2 px-3 py-2.5 border-b border-border-dim last:border-0 ${
                  row.status === "overdue" ? "bg-status-overdue-bg/40" : row.status === "missed" ? "bg-status-missed-bg/40" : ""
                }`}
              >
                <span className="text-[11px] font-mono text-ink-muted">{row.installment_number}</span>
                <span className="text-[11px] text-ink-dim">{new Date(row.due_date).toLocaleDateString()}</span>
                <span className="text-[11px] font-mono text-ink text-right">{kes(row.total_due)}</span>
                <span className={`text-[11px] font-mono text-right ${Number(row.amount_paid) > 0 ? "text-status-paid-text" : "text-ink-muted"}`}>
                  {kes(row.amount_paid)}
                </span>
                <div className="flex justify-end items-center">
                  <StatusBadge status={row.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Full Table */}
          <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ground border-b border-border">
                  <th className="py-3 px-4 text-[11px] font-mono font-semibold text-ink-muted uppercase tracking-wider w-12 text-center">#</th>
                  <th className="py-3 px-4 text-[11px] font-mono font-semibold text-ink-muted uppercase tracking-wider">Due Date</th>
                  <th className="py-3 px-4 text-[11px] font-mono font-semibold text-ink-muted uppercase tracking-wider text-right">Expected</th>
                  <th className="py-3 px-4 text-[11px] font-mono font-semibold text-ink-muted uppercase tracking-wider text-right">Paid</th>
                  <th className="py-3 px-4 text-[11px] font-mono font-semibold text-ink-muted uppercase tracking-wider text-right">Remaining</th>
                  <th className="py-3 px-4 text-[11px] font-mono font-semibold text-ink-muted uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dim">
                {schedule.map((row) => (
                  <tr 
                    key={row.id}
                    className={`hover:bg-ground/50 transition-colors ${
                      row.status === "overdue" ? "bg-status-overdue-bg/30" : row.status === "missed" ? "bg-status-missed-bg/30" : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-sm font-mono text-ink-muted text-center">{row.installment_number}</td>
                    <td className="py-4 px-4 text-sm font-medium text-ink-dim">{new Date(row.due_date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-sm font-mono text-ink text-right">{kes(row.total_due)}</td>
                    <td className={`py-4 px-4 text-sm font-mono text-right ${Number(row.amount_paid) > 0 ? "text-status-paid-text font-bold" : "text-ink-muted"}`}>
                      {kes(row.amount_paid)}
                    </td>
                    <td className="py-4 px-4 text-sm font-mono text-ink text-right">{kes(row.total_due - row.amount_paid)}</td>
                    <td className="py-4 px-4 text-center flex justify-center">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request time extension */}
        <div className="md:sticky md:top-8 mt-5 mx-5 md:mx-0 md:mt-0">
          {!showExtend ? (
            <div className="mb-6">
              <button
                onClick={() => setShowExtend(true)}
                className="w-full py-3 md:py-4 rounded border border-border bg-surface text-sm font-semibold text-ink-dim hover:bg-ground transition-colors"
              >
                Request Time Extension
              </button>
              <p className="text-[11px] md:text-xs text-ink-muted text-center mt-2 leading-relaxed">
                Available if loan is approaching maturity without default.
              </p>
            </div>
          ) : (
            <div className="mb-6 bg-surface border border-border rounded-lg p-4 md:p-6 shadow-sm">
              <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-4">Extension Request</p>
              <div className="flex flex-col gap-4">
                <select className="w-full px-4 py-3 rounded border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Reason for extension</option>
                  {extensionReasons.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <select className="w-full px-4 py-3 rounded border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Requested term</option>
                  {extensionTerms.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <button className="w-full py-3 md:py-3.5 rounded bg-primary text-white font-semibold text-sm hover:bg-primary-hover active:scale-[0.99] transition-transform">
                  Submit for Approval
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}