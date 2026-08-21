import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the data passed from Step 1 so we can bundle it all together
  const step1Data = location.state?.step1 || {};

  // Form state for operational and settlement details
  const [form, setForm] = useState({
    disbursement_account: "",
    collection_paybill_number: "",
    default_interest_rate: "",
    default_penalty_rate: "",
  });

  // Loading and error states for the API submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Basic validation: ensure all required inputs have values
  const isValid =
    form.disbursement_account.trim() &&
    form.collection_paybill_number.trim() &&
    form.default_interest_rate.trim() &&
    form.default_penalty_rate.trim();

  // Handle the final submission to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError("");

    // Combine step 1 and step 2 data, formatting numbers correctly
    const payload = {
      ...step1Data,
      ...form,
      default_interest_rate: parseFloat(form.default_interest_rate),
      default_penalty_rate: parseFloat(form.default_penalty_rate),
    };

    try {
      // Mock API call to create the institution
      const res = await fetch("http://localhost:5000/api/v1/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      // On success, redirect to the dashboard
      navigate("/lender/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Main container using our light ground color
    <div className="min-h-screen bg-ground px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Navigation back to step 1 (preserving data) */}
        <button
          onClick={() =>
            navigate("/lender/register", { state: { step1: step1Data } })
          }
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors mb-4 cursor-pointer"
        >
          ← Back
        </button>

        {/* Breadcrumb step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          <span className="text-xs tracking-[0.15em] text-ink-muted uppercase font-medium">
            Step 2 of 2 — Operational & Settlement
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-ink mb-6">
          Settlement & Rate Configuration
        </h1>

        {/* The main form container */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border-dim rounded-lg p-6 md:p-8"
        >
          {/* Row 1: Disbursement Bank Account + Collection Paybill */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Disbursement Bank Account
              </label>
              <input
                type="text"
                name="disbursement_account"
                value={form.disbursement_account}
                onChange={handleChange}
                placeholder="e.g. 1234567890 — Equity Bank"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                M-Pesa Paybill / Till Number
              </label>
              <input
                type="text"
                name="collection_paybill_number"
                value={form.collection_paybill_number}
                onChange={handleChange}
                placeholder="e.g. 123456"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2: Default Interest Rate + Penalty Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Default Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="default_interest_rate"
                value={form.default_interest_rate}
                onChange={handleChange}
                placeholder="e.g. 15"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Default Penalty Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="default_penalty_rate"
                value={form.default_penalty_rate}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Compliance notice */}
          <div className="border border-primary/30 bg-compliance-bg rounded-lg px-5 py-4 mb-6">
            <p className="text-sm font-semibold text-primary mb-1">
              Platform Compliance Review
            </p>
            <p className="text-xs text-ink-dim leading-relaxed">
              Your submission enters a platform-level compliance queue. The first
              Super Admin account activates once approved. This review is
              independent from your institution's internal Maker-Checker desk.
            </p>
          </div>

          {/* Error message display */}
          {error && (
            <div className="bg-status-overdue-bg border border-status-overdue-border text-status-overdue-text text-sm rounded-md px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Final Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-200
                ${
                  isValid && !submitting
                    ? "bg-primary hover:bg-primary-hover text-white cursor-pointer"
                    : "bg-ground-dim text-ink-muted cursor-not-allowed"
                }`}
            >
              {submitting ? "Submitting…" : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
