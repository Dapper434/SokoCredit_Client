import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loanWizardConfig } from "../../data/mockCustomerData";

const { limit, interestRate, processingFeeRate, exciseRate, quickAmounts, durations, purposes, disbursementMpesaNumber } =
  loanWizardConfig;

function computeCosts(principal, days) {
  const interest = principal * interestRate * (days / 30);
  const processingFee = principal * processingFeeRate;
  const excise = processingFee * exciseRate;
  const total = principal + interest + processingFee + excise;
  return { interest, processingFee, excise, total };
}

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
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(30);
  const [frequency, setFrequency] = useState("weekly");
  const [purpose, setPurpose] = useState("");
  const [consented, setConsented] = useState(false);

  const costs = computeCosts(amount, duration);
  const installments = frequency === "lump_sum" ? 1 : frequency === "daily" ? duration : Math.ceil(duration / 7);
  const installmentAmount = costs.total / installments;

  const handleBack = () => {
    if (step === 1) navigate("/customer/hub");
    else setStep(1);
  };

  const handleSubmit = () => {
    navigate("/customer/hub");
  };

  return (
    <div className="flex flex-col min-h-screen bg-ground">
      {/* Header */}
      <div className="bg-primary px-6 pt-8 pb-10">
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
            Limit: <span className="font-mono font-semibold">KES {limit.toLocaleString()}</span>
          </p>
        )}
      </div>

      <div className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-5 pt-7 pb-6 flex flex-col gap-6">
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
                  max={limit}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1">
                  <span>KES 500</span>
                  <span>KES {limit.toLocaleString()}</span>
                </div>
              </div>
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
              className={`w-full py-3.5 rounded font-semibold text-sm mt-2 transition-all ${
                !purpose ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              Review Loan Terms
            </button>
          </>
        ) : (
          <>
            {/* Cost breakdown */}
            <div className="bg-surface rounded border border-border p-4">
              <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">Cost Breakdown</p>
              <CostRow label="Principal" value={kes(amount)} />
              <CostRow label={`Interest (15% × ${duration}d)`} value={kes(costs.interest)} muted />
              <CostRow label="Processing fee (3%)" value={kes(costs.processingFee)} muted />
              <CostRow label="Excise duty on fee (20%)" value={kes(costs.excise)} muted />
              <CostRow label="Total Repayable" value={kes(costs.total)} bold />
              <div className="mt-3 pt-3 border-t border-border-dim">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ink-dim">
                    Per {frequency === "daily" ? "day" : frequency === "weekly" ? "week" : "payment"}
                  </span>
                  <span className="font-mono font-bold text-primary text-base">{kes(installmentAmount)}</span>
                </div>
                <p className="text-[11px] text-ink-muted mt-1 font-mono">
                  {installments} installment{installments !== 1 ? "s" : ""} over {duration} days
                </p>
              </div>
            </div>

            {/* Disbursement info */}
            <div className="bg-primary-light border border-status-paid-border rounded px-4 py-3">
              <p className="text-[10px] font-semibold text-status-paid-text uppercase tracking-wide mb-1">
                Disbursement via M-Pesa
              </p>
              <p className="text-sm font-mono font-semibold text-ink">{disbursementMpesaNumber}</p>
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

            <button
              onClick={handleSubmit}
              disabled={!consented}
              className={`w-full py-3.5 rounded font-semibold text-sm transition-all ${
                !consented ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              Confirm & Request Disbursement
            </button>
          </>
        )}
      </div>
    </div>
  );
}