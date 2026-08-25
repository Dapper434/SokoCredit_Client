import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveSession, signupOrganization, toOrganizationSlug } from "../../lib/api";

export default function RegisterStep3() {
  const navigate = useNavigate();
  const location = useLocation();

  const combinedData = location.state?.combinedData || {};

  const [form, setForm] = useState({
    disbursement_account: "",
    collection_paybill_number: "",
    airtel_money_paybill: "",
    default_interest_rate: "",
    default_penalty_rate: "",
    admin_full_name: "",
    admin_email: "",
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
    form.disbursement_account.trim() &&
    form.collection_paybill_number.trim() &&
    form.airtel_money_paybill.trim() &&
    form.default_interest_rate.trim() &&
    form.default_penalty_rate.trim() &&
    form.admin_full_name.trim() &&
    form.admin_email.trim() &&
    form.admin_password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError("");

    const payload = {
      name: combinedData.registered_business_name.trim(),
      slug: toOrganizationSlug(
        combinedData.registered_business_name,
        combinedData.registration_number,
      ),
      admin_email: form.admin_email.trim(),
      admin_password: form.admin_password,
      admin_full_name: form.admin_full_name.trim(),
    };

    try {
      const data = await signupOrganization(payload);
      saveSession(data);

      // Save the founding admin into the staff roster so they can
      // log in again later and be recognised by name + role
      const existingRoster = JSON.parse(localStorage.getItem("sokocredit_staff_roster") || "[]");
      const alreadyExists = existingRoster.some(
        (s) => s.email.toLowerCase() === form.admin_email.trim().toLowerCase()
      );
      if (!alreadyExists) {
        const maxId = existingRoster.reduce((max, s) => Math.max(max, s.id || 0), 0);
        existingRoster.push({
          id: maxId + 1,
          name: form.admin_full_name.trim(),
          email: form.admin_email.trim(),
          phone: "",
          password: form.admin_password,
          role: "branch_manager",
          markets: ["All"],
          borrowers: 0,
          lastActive: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          status: "active",
        });
        localStorage.setItem("sokocredit_staff_roster", JSON.stringify(existingRoster));
      }

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
                M-Pesa Paybill Number
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
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Airtel Money Paybill Number
              </label>
              <input
                type="text"
                name="airtel_money_paybill"
                value={form.airtel_money_paybill}
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

          <div className="border-t border-border-dim pt-6 mb-6">
            <h2 className="text-sm font-semibold text-ink mb-1">
              Administrator Account
            </h2>
            <p className="text-xs text-ink-dim mb-5">
              This account becomes your institution&apos;s first admin on SokoCredit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="admin_full_name"
                  value={form.admin_full_name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Kamau"
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                             placeholder:text-ink-muted/50
                             focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  name="admin_email"
                  value={form.admin_email}
                  onChange={handleChange}
                  placeholder="admin@institution.co.ke"
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                             placeholder:text-ink-muted/50
                             focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                type="password"
                name="admin_password"
                value={form.admin_password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
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
