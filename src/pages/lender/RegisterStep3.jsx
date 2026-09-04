import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signupOrganization } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useSessionState } from "../../hooks/useSessionState";

export default function RegisterStep3() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const combinedData = location.state?.combinedData || {};

  const [form, setForm] = useSessionState("lender_step3", {
    mpesa_paybill: "",
    airtel_money_till: "",
    default_interest_rate: "",
    default_penalty_rate: "",
    admin_password: "",
    confirmed: false,
  });

  // Loading and error states for the API submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const isValid =
    combinedData.registered_business_name?.trim() &&
    form.mpesa_paybill.trim() &&
    form.airtel_money_till.trim() &&
    form.default_interest_rate.trim() &&
    form.default_penalty_rate.trim() &&
    form.admin_password.length >= 8 &&
    form.confirmed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError("");

    const staffParsed = combinedData.estimated_staff
      ? parseInt(String(combinedData.estimated_staff), 10)
      : NaN;

    const payload = {
      // Step 1 fields (Identity & Physical Presence)
      registered_business_name: (combinedData.registered_business_name || "").trim(),
      registration_number: (combinedData.registration_number || "").trim(),
      kra_pin: (combinedData.kra_pin || "").trim(),
      operating_license_type: combinedData.license_category || null,
      cbk_license_number: combinedData.cbk_license_number || null,
      head_office_address: (combinedData.head_office_address || "").trim(),

      // Step 2 fields (Compliance & Operations)
      county_business_permit_number: combinedData.county_business_permit || null,
      odpc_registration_number: combinedData.odpc_registration_number || null,
      estimated_staff_count: Number.isFinite(staffParsed) ? staffParsed : null,
      admin_full_name: (combinedData.director_full_name || "").trim(),
      admin_national_id_number: combinedData.director_national_id || null,
      admin_email: (combinedData.official_work_email || "").trim(),
      admin_password: form.admin_password,

      // Step 3 fields (Settlement & Rates)
      collection_paybill_number: form.mpesa_paybill.trim() || null,
      airtel_paybill_number: form.airtel_money_till.trim() || null,
      default_interest_rate: form.default_interest_rate ? parseFloat(form.default_interest_rate) : null,
      default_penalty_rate: form.default_penalty_rate ? parseFloat(form.default_penalty_rate) : null,

      // Markets from Step 2
      primary_markets: combinedData.markets_covered || [],
    };

    try {
      const data = await signupOrganization(payload);
      // Backend returns { access_token, user, institution, role }
      login(data.access_token, data.user);
      
      // Clear draft data
      sessionStorage.removeItem("lender_step1");
      sessionStorage.removeItem("lender_step2");
      sessionStorage.removeItem("lender_step3");
      
      navigate("/lender/register/success", { replace: true });
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
                  M-Pesa Paybill
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
                  Airtel Money Paybill
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
            <div className="relative w-full md:w-1/2">
              <input
                type={showPassword ? "text" : "password"}
                name="admin_password"
                value={form.admin_password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
                className="w-full border border-border rounded-md px-4 py-3 pr-12 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.28 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Compliance notice */}
          <div className="border border-status-active-border bg-status-active-bg rounded-lg px-5 py-4 mb-6">
            <p className="text-sm font-semibold text-status-active-text mb-1">
              Platform Compliance Review
            </p>
            <p className="text-xs text-status-active-text/80 leading-relaxed">
              Your submission creates a Compliance Dossier for SokoCredit's internal audit team. Account activation requires
              physical verification, document validation, and execution of a Service Level Agreement. This process is independent
              from your institution's internal Maker-Checker desk.
            </p>
          </div>

          {/* Confirmation Checkbox */}
          <div className="mb-8 flex items-start gap-3">
            <input
              type="checkbox"
              name="confirmed"
              id="confirmed"
              checked={form.confirmed}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2 cursor-pointer"
            />
            <label htmlFor="confirmed" className="text-sm text-ink-dim cursor-pointer leading-relaxed select-none">
              I confirm that this institution operates legally in Kenya. I understand that account activation requires physical verification, document validation, and execution of a SokoCredit Service Level Agreement.
            </label>
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
                    ? "bg-[#D6D1C4] hover:bg-[#C5C0B3] text-ink cursor-pointer"
                    : "bg-ground-dim text-ink-muted cursor-not-allowed"
                }`}
            >
              {submitting ? "Submitting…" : "Submit Application for Compliance Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
