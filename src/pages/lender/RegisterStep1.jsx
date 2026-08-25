import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Standard license types for the dropdown selection
const LICENSE_TYPES = [
  "Microfinance Institution (Tier 3)",
  "Digital Credit Provider",
  "SACCO",
  "NGO — Credit Wing",
];

export default function RegisterStep1() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilled = location.state?.step1 || {};

  // State object holding all onboarding business data
  const [form, setForm] = useState({
    registered_business_name: prefilled.registered_business_name || "",
    registration_number: prefilled.registration_number || "",
    kra_pin: prefilled.kra_pin || "",
    license_category: prefilled.license_category || "",
    cbk_license_number: prefilled.cbk_license_number || "",
    head_office_address: prefilled.head_office_address || "",
  });

  // Generic handler to update any form field based on its name attribute
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Basic validation: ensure core business identifiers are filled
  const isValid =
    form.registered_business_name.trim() &&
    form.registration_number.trim() &&
    form.kra_pin.trim() &&
    form.license_category.trim() &&
    form.cbk_license_number.trim() &&
    form.head_office_address.trim();

  // Proceed to Step 2, passing the current form data via React Router state
  const handleContinue = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/lender/register/compliance", { state: { step1: form } });
  };

  return (
    // Main container using our light ground color
    <div className="min-h-screen bg-ground px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Navigation back to sign in */}
        <button
          onClick={() => navigate("/lender/signin")}
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors mb-4 cursor-pointer"
        >
          ← Back to sign in
        </button>

        {/* Breadcrumb step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-1 rounded-full bg-primary inline-block" />
          <span className="w-8 h-1 rounded-full bg-ground-dim inline-block" />
          <span className="w-8 h-1 rounded-full bg-ground-dim inline-block" />
          <span className="text-xs tracking-[0.15em] text-ink-muted uppercase font-medium ml-2">
            Step 1 of 3
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-ink mb-6">
          Business Identity & Physical Presence
        </h1>

        {/* The main registration form card */}
        <form
          onSubmit={handleContinue}
          className="bg-surface border border-border-dim rounded-lg p-6 md:p-8"
        >
          {/* Row 1: Business Name + BRS Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Registered Business Name
              </label>
              <input
                type="text"
                name="registered_business_name"
                value={form.registered_business_name}
                onChange={handleChange}
                placeholder="e.g. Jua Microfinance Ltd"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                BRS Registration / Certificate No.
              </label>
              <input
                type="text"
                name="registration_number"
                value={form.registration_number}
                onChange={handleChange}
                placeholder="e.g. PVT-123456"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2: KRA PIN + License Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                Company KRA PIN
              </label>
              <input
                type="text"
                name="kra_pin"
                value={form.kra_pin}
                onChange={handleChange}
                placeholder="e.g. P051234567M"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                License Category
              </label>
              <div className="relative">
                <select
                  name="license_category"
                  value={form.license_category}
                  onChange={handleChange}
                  className="w-full border-2 border-primary rounded-md px-4 py-3 text-ink bg-surface
                             appearance-none cursor-pointer font-medium
                             focus:outline-none focus:border-primary-hover transition-colors"
                  required
                >
                  <option value="" disabled>Select type</option>
                  {LICENSE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 3: CBK Digital Credit Provider License No. + Certificate Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 p-5 bg-ground/30 rounded-lg border border-border-dim">
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                CBK Digital Credit Provider License No.
              </label>
              <input
                type="text"
                name="cbk_license_number"
                value={form.cbk_license_number}
                onChange={handleChange}
                placeholder="e.g. CBK/DCP/2024/001"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-surface
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors mb-1"
                required
              />
              <p className="text-[10px] text-ink-muted leading-relaxed">Enter the number exactly as it appears on the certificate.</p>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                License Certificate Upload
              </label>
              <div className="w-full border border-dashed border-border-dim rounded-md px-4 py-3 flex items-center justify-center bg-surface cursor-pointer hover:bg-ground transition-colors mb-1">
                <span className="text-sm font-medium text-ink-dim">Upload PDF or image</span>
              </div>
              <p className="text-[10px] text-ink-muted leading-relaxed">PDF or image. This is required to verify your licence claim.</p>
            </div>
          </div>

          {/* Head Office Address */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
              Head Office Address
            </label>
            <input
              type="text"
              name="head_office_address"
              value={form.head_office_address}
              onChange={handleChange}
              placeholder="Street, building, town"
              className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                         placeholder:text-ink-muted/50
                         focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Map placeholder */}
          <div className="relative border border-border-dim rounded-lg bg-[#F5F5F0] overflow-hidden mb-8 h-32 flex flex-col items-center justify-center">
            {/* Minimal grid background to look like a map placeholder */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary mb-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <p className="text-xs font-medium text-ink">Address geocodes to map pin</p>
              <p className="text-[10px] text-ink-muted mt-0.5">Google Maps Places API</p>
            </div>
          </div>

          {/* Form Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isValid}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200
                ${
                  isValid
                    ? "bg-surface hover:bg-ground text-ink border border-border cursor-pointer shadow-sm"
                    : "bg-ground-dim text-ink-muted cursor-not-allowed border border-transparent"
                }`}
            >
              Continue to Compliance Details
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
