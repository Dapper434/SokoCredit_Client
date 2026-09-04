import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loanWizardConfig } from "../../data/mockCustomerData";
import { applyForLoan, getSession, getLoanTerms } from "../../lib/api";

const { quickAmounts, durations, purposes } = loanWizardConfig;

// NOTE: interest is deliberately NOT computed here. Every figure below comes
// from GET /api/underwriting/loan-terms, which prices the loan with the same
// calculate_loan_totals() that generates the real repayment schedule. Adding a
// local formula is what caused the original 15%-vs-5% mismatch — don't.

function kes(n) {
  return `KES ${n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function CostRow({ label, value, bold = false, muted = false }) {
  return (
    <div className={`flex justify-between items-center py-2.5 ${bold ? "border-t border-border mt-1 pt-3" : ""}`}>
      <span className={`text-sm ${muted ? "text-ink-muted" : "text-ink-dim"}`}>{label}</span>
      <span className={`font-mono text-sm ${bold ? "font-bold text-ink text-base" : muted ? "text-ink-muted" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}

export default function LoanWizard() {
  const navigate = useNavigate();
  const session = getSession();
  const mpesaNumber = session?.user?.phone_number || "Unavailable";
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(30);
  const [frequency, setFrequency] = useState("weekly");
  const [purpose, setPurpose] = useState("");
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Live quote from the backend — the authoritative cost of this loan.
  const [ratePercent, setRatePercent] = useState(null);
  const [quote, setQuote] = useState(null);

  // Borrowing limits, recomputed by the backend on every call from the same
  // get_available_credit() that gates the application — so KES 200 check-ins
  // made moments ago are already reflected here.
  const [limit, setLimit] = useState(null);
  const [maxLoanLimit, setMaxLoanLimit] = useState(null);

  // Debounced so dragging the amount/term slider does not fire a request per pixel.
  useEffect(() => {
    const timer = setTimeout(() => {
      getLoanTerms({ amount, term_days: duration, repayment_frequency: frequency })
        .then((terms) => {
          setRatePercent(parseFloat(terms.interest_rate));
          setQuote(terms.quote);
          setLimit(Number(terms.available_credit) || 0);
          setMaxLoanLimit(Number(terms.max_loan_limit) || 0);
          setError(null);
        })
        .catch(() => setError("Could not price this loan. Please try again."));
    }, 300);
    return () => clearTimeout(timer);
  }, [amount, duration, frequency]);

  // Over-limit is allowed — it routes to lender review rather than being blocked.
  const overLimit = limit !== null && amount > limit;

  const quoted = quote !== null;
  const installments = quoted ? quote.num_installments : 0;
  const installmentAmount = quoted ? Number(quote.installment_amount) : 0;
  const finalInstallment = quoted ? Number(quote.final_installment_amount) : 0;
  const hasUnevenFinal = quoted && installments > 1 && finalInstallment !== installmentAmount;

  const handleBack = () => {
    if (step === 1) navigate("/customer/hub");
    else setStep(1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await applyForLoan({
        principal: amount,
        term_days: duration,
        repayment_frequency: frequency,
        loan_purpose: purpose
      });
      navigate("/customer/hub", { state: { loanApplied: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-ground md:bg-transparent md:max-w-5xl md:mx-auto md:p-8 md:grid md:grid-cols-[1fr_350px] md:gap-8 md:items-start">
      
      {/* Mobile Header */}
      <div className="bg-primary px-6 pt-8 pb-10 md:hidden">
        <div className="flex items-center justify-between mb-5">
          <button onClick={handleBack} className="text-white/70 text-sm flex items-center gap-1.5 hover:text-white">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <span className="text-xs text-white/60 font-mono">Step {step} of 2</span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full mb-5">
          <div className={`h-full bg-white rounded-full transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`} />
        </div>
        <h1 className="text-xl font-bold text-white mb-1">
          {step === 1 ? "Configure Your Loan" : "Review & Confirm"}
        </h1>
        {step === 1 && (
          <p className="text-sm text-white/70">
            Pre-approved: <span className="font-mono font-semibold">{limit === null ? "…" : `KES ${limit.toLocaleString()}`}</span>
          </p>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-5 pt-7 pb-6 flex flex-col gap-6 md:rounded-lg md:mt-0 md:border md:border-border md:shadow-sm md:p-8">
        
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col mb-2">
          <button onClick={handleBack} className="text-ink-dim text-sm flex items-center gap-1.5 hover:text-ink w-fit mb-4">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Hub
          </button>
          <h1 className="text-2xl font-bold text-ink mb-1">
            {step === 1 ? "Configure Your Loan" : "Review & Confirm"}
          </h1>
          <p className="text-sm text-ink-muted">
            {step === 1 ? (limit === null ? "Loading your limit…" : `Pre-approved up to KES ${limit.toLocaleString()}`) : "Please review terms and sign your consent."}
          </p>
        </div>

        {step === 1 ? (
          <>
            {/* Amount */}
            <div>
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide block mb-3">Loan Amount</label>
              <div className="bg-surface rounded border border-border p-4 mb-3">
                <p className="text-3xl font-bold font-mono text-ink text-center mb-3">KES {amount.toLocaleString()}</p>
                <input
                  type="range"
                  min={500}
                  max={maxLoanLimit ?? 500}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1">
                  <span>KES 500</span>
                  <span>{maxLoanLimit === null ? "…" : `KES ${maxLoanLimit.toLocaleString()}`}</span>
                </div>
              </div>
              {overLimit && (
                <div className="mb-3 rounded border border-status-due-border bg-status-due-bg px-3 py-2.5">
                  <p className="text-xs font-semibold text-status-due-text">
                    Amounts above your current limit require lender review
                  </p>
                  <p className="text-[11px] text-ink-dim mt-0.5">
                    You can still apply. Anything above your pre-approved
                    {limit !== null && ` KES ${limit.toLocaleString()}`} goes to a
                    loan officer for manual approval instead of being processed automatically.
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(q)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold border transition-colors ${
                      amount === q
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-ink-dim border-border hover:border-primary"
                    }`}
                  >
                    {q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide block mb-3">Duration</label>
              <div className="flex gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2.5 rounded text-xs font-semibold border transition-colors ${
                      duration === d
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-ink-dim border-border hover:border-primary"
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide block mb-3">Repayment Frequency</label>
              <div className="flex rounded border border-border overflow-hidden bg-surface">
                {["daily", "weekly", "lump_sum"].map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${i > 0 ? "border-l border-border" : ""} ${
                      frequency === f ? "bg-primary text-white" : "text-ink-dim hover:bg-ground"
                    }`}
                  >
                    {f === "lump_sum" ? "Lump Sum" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide block mb-3">Loan Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 rounded border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select purpose</option>
                {purposes.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!purpose}
              className={`w-full py-3.5 rounded font-semibold text-sm mt-2 transition-all md:hidden ${
                !purpose ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              Review Loan Terms
            </button>
          </>
        ) : (
          <>
            {/* Mobile Cost breakdown (Hidden on desktop since it's in the right panel) */}
            <div className="md:hidden bg-surface rounded border border-border p-4">
              <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">Cost Breakdown</p>
              <CostRow label="Principal" value={kes(amount)} />
              <CostRow
                label={ratePercent !== null ? `Interest (${ratePercent}% p.a. × ${duration}d)` : "Interest"}
                value={quoted ? kes(Number(quote.interest)) : "—"}
                muted
              />
              <CostRow label="Total Repayable" value={quoted ? kes(Number(quote.total_repayable)) : "—"} bold />
              <div className="mt-3 pt-3 border-t border-border-dim">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ink-dim">
                    Per {frequency === "daily" ? "day" : frequency === "weekly" ? "week" : "payment"}
                  </span>
                  <span className="font-mono font-bold text-primary text-base">{quoted ? kes(installmentAmount) : "—"}</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 font-mono">
                  {installments} installment{installments !== 1 ? "s" : ""} over {duration} days
                  {hasUnevenFinal && ` · last ${kes(finalInstallment)}`}
                </p>
              </div>
            </div>

            {/* Disbursement info */}
            <div className="bg-primary-light border border-status-paid-border rounded px-4 py-3">
              <p className="text-[10px] font-semibold text-status-paid-text uppercase tracking-wide mb-1">
                Disbursement via M-Pesa
              </p>
              <p className="text-sm font-mono font-semibold text-ink">{mpesaNumber}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">Funds sent within minutes of approval</p>
            </div>

            {/* Consent */}
            <label className="flex gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-border accent-primary cursor-pointer flex-shrink-0"
              />
              <span className="text-xs text-ink-dim leading-relaxed">
                I have read and agree to the loan terms above, including the processing fee and excise duty. I
                understand that repayments are due as scheduled and that missed payments attract penalties.
              </span>
            </label>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded text-sm border border-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!consented || submitting}
              className={`md:hidden w-full py-3.5 rounded font-semibold text-sm transition-all ${
                (!consented || submitting) ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {submitting ? "Submitting..." : "Confirm & Request Disbursement"}
            </button>
          </>
        )}
      </div>

      {/* Desktop Sticky Cost Summary */}
      <div className="hidden md:block sticky top-8 bg-ground border border-border rounded-lg shadow-sm p-6">
        <p className="text-sm font-bold text-ink uppercase tracking-wide mb-4">Live Cost Summary</p>
        
        <div className="space-y-1 mb-4">
          <CostRow label="Principal" value={kes(amount)} />
          <CostRow
            label={ratePercent !== null ? `Interest (${ratePercent}% p.a. × ${duration}d)` : "Interest"}
            value={quoted ? kes(Number(quote.interest)) : "—"}
            muted
          />
        </div>

        <div className="bg-surface rounded border border-border-dim p-4 mb-6">
           <CostRow label="Total Repayable" value={quoted ? kes(Number(quote.total_repayable)) : "—"} bold />
           <div className="mt-3 pt-3 border-t border-border-dim">
             <div className="flex justify-between items-center">
               <span className="text-sm text-ink-dim">
                 Per {frequency === "daily" ? "day" : frequency === "weekly" ? "week" : "payment"}
               </span>
               <span className="font-mono font-bold text-primary text-lg">{quoted ? kes(installmentAmount) : "—"}</span>
             </div>
             <p className="text-[11px] text-ink-muted mt-1 font-mono">
               {installments} installment{installments !== 1 ? "s" : ""} over {duration} days
               {hasUnevenFinal && ` · last ${kes(finalInstallment)}`}
             </p>
           </div>
        </div>

        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            disabled={!purpose}
            className={`w-full py-3.5 rounded font-semibold text-sm transition-all ${
              !purpose ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            Review Loan Terms
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!consented || submitting}
            className={`w-full py-3.5 rounded font-semibold text-sm transition-all ${
              (!consented || submitting) ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {submitting ? "Submitting..." : "Confirm & Request"}
          </button>
        )}
      </div>

    </div>
  );
}