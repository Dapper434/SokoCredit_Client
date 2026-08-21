import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Standard license types for the dropdown selection
const LICENSE_TYPES = [
  "Microfinance Institution (Tier 3)",
  "Digital Credit Provider",
  "SACCO",
  "NGO — Credit Wing",
];

export default function RegisterStep1() {
  const navigate = useNavigate();

  // State object holding all onboarding business data
  const [form, setForm] = useState({
    registered_business_name: "",
    registration_number: "",
    kra_pin: "",
    operating_license_type: "",
    head_office_address: "",
  });

  // Generic handler to update any form field based on its name attribute
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Basic validation: ensure core business identifiers are filled
  const isValid =
    form.registered_business_name.trim() &&
    form.registration_number.trim() &&
    form.kra_pin.trim();

  // Proceed to Step 2, passing the current form data via React Router state
  const handleContinue = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/lender/register/settlement", { state: { step1: form } });
  };

  return (
    // Main container using our light ground color
    <div className="min-h-screen bg-ground px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Navigation back to sign in */}
        <button
          onClick={() => navigate("/lender/signin")}
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors mb-4 cursor-pointer"
        >
          ← Back to sign in
        </button>

        {/* Breadcrumb step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          <span className="text-xs tracking-[0.15em] text-ink-muted uppercase font-medium">
            Step 1 of 2 — Business Identity
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-ink mb-6">
          Register your Institution
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
                placeholder="e.g. Jua Sunny Ltd"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                BRS Registration Number
              </label>
              <input
                type="text"
                name="registration_number"
                value={form.registration_number}
                onChange={handleChange}
                placeholder="PVT-008080"
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
                KRA PIN
              </label>
              <input
                type="text"
                name="kra_pin"
                value={form.kra_pin}
                onChange={handleChange}
                placeholder="P0808"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                License Type
              </label>
              <div className="relative">
                <select
                  name="operating_license_type"
                  value={form.operating_license_type}
                  onChange={handleChange}
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-surface
                             appearance-none cursor-pointer
                             focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select type</option>
                  {LICENSE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none"
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

          {/* We will add the Office Address, Map, and Submit button here */}
        </form>

      </div>
    </div>
  );
}
