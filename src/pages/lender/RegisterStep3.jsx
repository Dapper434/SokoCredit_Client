import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveSession, signupOrganization, toOrganizationSlug } from "../../lib/api";

export default function RegisterStep3() {
  const navigate = useNavigate();
  const location = useLocation();

  const combinedData = location.state?.combinedData || {};

  const [form, setForm] = useState({
    mpesa_paybill: "",
    airtel_money_till: "",
    default_interest_rate: "",
    default_penalty_rate: "",
    admin_password: "",
  });

  // Loading and error states for the API submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid =
    combinedData.registered_business_name?.trim() &&
    form.mpesa_paybill.trim() &&
    form.airtel_money_till.trim() &&
    form.default_interest_rate.trim() &&
    form.default_penalty_rate.trim() &&
    form.admin_password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError("");

    const businessName = combinedData.registered_business_name || "Unknown Business";
    const regNumber = combinedData.registration_number || "";
    const email = combinedData.official_work_email || "admin@example.com";
    const fullName = combinedData.director_full_name || "Admin User";

    const payload = {
      name: businessName.trim(),
      slug: toOrganizationSlug(businessName, regNumber),
      admin_email: email.trim(),
      admin_password: form.admin_password,
      admin_full_name: fullName.trim(),
    };

    try {
      const data = await signupOrganization(payload);
      saveSession(data);
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
        
        {/* Navigation back to step 2 (preserving data) */}
        <button
          onClick={() =>
            navigate("/lender/register/compliance", { state: { step1: combinedData } })
          }
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors mb-4 cursor-pointer"
        >
          ← Back
        </button>

        {/* Breadcrumb step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-1 rounded-full bg-primary inline-block" />
          <span className="w-8 h-1 rounded-full bg-primary inline-block" />
          <span className="w-8 h-1 rounded-full bg-primary inline-block" />
          <span className="text-xs tracking-[0.15em] text-ink-muted uppercase font-medium ml-2">
            Step 3 of 3
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
          {/* Row 1: Mobile Money Collections & Disbursements */}
          <div className="mb-5 border-b border-border-dim pb-6">
            <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">
              Mobile Money Collections & Disbursements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold text-ink-dim uppercase tracking-wide mb-2">
                  M-Pesa Paybill / Till
                </label>
                <input
                  type="text"
                  name="mpesa_paybill"
                  value={form.mpesa_paybill}
                  onChange={handleChange}
                  placeholder="e.g. 123456"
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                             placeholder:text-ink-muted/50
                             focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-ink-dim uppercase tracking-wide mb-2">
                  Airtel Money Till / Paybill
                </label>
                <input
                  type="text"
                  name="airtel_money_till"
                  value={form.airtel_money_till}
                  onChange={handleChange}
                  placeholder="e.g. 123456"
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                             placeholder:text-ink-muted/50
                             focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
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

          <div className="mb-6 pb-6 border-b border-border-dim">
            <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
              Administrator Password
            </h2>
            <p className="text-[10px] text-ink-dim mb-3">
              Set a secure password for your institution's primary director account ({combinedData.official_work_email || "your email"}).
            </p>
            <input
              type="password"
              name="admin_password"
              value={form.admin_password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              minLength={8}
              className="w-full md:w-1/2 border border-border rounded-md px-4 py-3 text-ink bg-transparent
                         placeholder:text-ink-muted/50
                         focus:outline-none focus:border-primary transition-colors"
              required
            />
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
