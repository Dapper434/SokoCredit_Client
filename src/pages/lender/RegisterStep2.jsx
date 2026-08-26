import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STAFF_RANGES = ["1-5", "6-15", "16-30", "31-60", "60+"];
const MARKET_OPTIONS = ["Toi Market", "Muthurwa", "Gikomba", "Kangemi", "Wakulima", "Other"];

export default function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();

  const step1Data = location.state?.step1 || {};
  const initialStep2 = location.state?.step2 || {};

  const [form, setForm] = useState({
    county_business_permit: initialStep2.county_business_permit || "",
    odpc_registration_number: initialStep2.odpc_registration_number || "",
    director_full_name: initialStep2.director_full_name || "",
    director_national_id: initialStep2.director_national_id || "",
    official_work_email: initialStep2.official_work_email || "",
    estimated_staff: initialStep2.estimated_staff || "",
    markets_covered: initialStep2.markets_covered || [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMarket = (market) => {
    setForm((prev) => {
      const isSelected = prev.markets_covered.includes(market);
      return {
        ...prev,
        markets_covered: isSelected
          ? prev.markets_covered.filter((m) => m !== market)
          : [...prev.markets_covered, market],
      };
    });
  };

  const isValid =
    form.county_business_permit.trim() &&
    form.odpc_registration_number.trim() &&
    form.director_full_name.trim() &&
    form.director_national_id.trim() &&
    form.official_work_email.trim() &&
    form.estimated_staff.trim() &&
    form.markets_covered.length > 0;

  const handleContinue = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    // Combine step1 and step2 data to pass to step 3
    const combinedData = { ...step1Data, ...form };
    navigate("/lender/register/settlement", { state: { combinedData } });
  };
  return (
    <div className="min-h-screen bg-ground px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Navigation back to step 1 (preserving data) */}
        <button
          onClick={() => navigate("/lender/register", { state: { step1: step1Data, step2: form } })}
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors mb-4 cursor-pointer"
        >
          ← Back
        </button>

        {/* Breadcrumb step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-1 rounded-full bg-primary inline-block" />
          <span className="w-8 h-1 rounded-full bg-primary inline-block" />
          <span className="w-8 h-1 rounded-full bg-ground-dim inline-block" />
          <span className="text-xs tracking-[0.15em] text-ink-muted uppercase font-medium ml-2">
            Step 2 of 3
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-ink mb-6">
          Regulatory Compliance, Operations & Staff Footprint
        </h1>

        {/* The main form container */}
        <form
          onSubmit={handleContinue}
          className="bg-surface border border-border-dim rounded-lg p-6 md:p-8"
        >
          {/* Row 1: County Permit + ODPC Reg */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                County Single Business Permit No.
              </label>
              <input
                type="text"
                name="county_business_permit"
                value={form.county_business_permit}
                onChange={handleChange}
                placeholder="e.g. NRB/SBP/2024/78432"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors mb-1"
                required
              />
              <p className="text-[10px] text-ink-muted leading-relaxed">SBP issued by county government</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                ODPC Data Controller Reg. No.
              </label>
              <input
                type="text"
                name="odpc_registration_number"
                value={form.odpc_registration_number}
                onChange={handleChange}
                placeholder="e.g. ODPC/DC/2024/001"
                className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                           placeholder:text-ink-muted/50
                           focus:outline-none focus:border-primary transition-colors mb-1"
                required
              />
              <p className="text-[10px] text-ink-muted leading-relaxed">Mandatory under Kenya Data Protection Act 2019</p>
            </div>
          </div>
          <div className="border-t border-border-dim pt-6 mb-5">
            <h2 className="text-sm font-semibold text-ink mb-4 uppercase tracking-wide">
              Primary Director / Principal Officer
            </h2>
            
            {/* Row 2: Director Name + ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  name="director_full_name"
                  value={form.director_full_name}
                  onChange={handleChange}
                  placeholder="As on National ID"
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                             placeholder:text-ink-muted/50
                             focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                  National ID Number
                </label>
                <input
                  type="text"
                  name="director_national_id"
                  value={form.director_national_id}
                  onChange={handleChange}
                  placeholder="e.g. 12345678"
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                             placeholder:text-ink-muted/50
                             focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
            
            {/* Row 3: Official Work Email + Estimated Staff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                  Official Work Email
                </label>
                <input
                  type="email"
                  name="official_work_email"
                  value={form.official_work_email}
                  onChange={handleChange}
                  placeholder="director@institution.co.ke"
                  className="w-full border border-border rounded-md px-4 py-3 text-ink bg-transparent
                             placeholder:text-ink-muted/50
                             focus:outline-none focus:border-primary transition-colors mb-1"
                  required
                />
                <p className="text-[10px] text-ink-muted leading-relaxed">Must match corporate domain</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                  Estimated Field Staff / Loan Officers
                </label>
                <div className="relative">
                  <select
                    name="estimated_staff"
                    value={form.estimated_staff}
                    onChange={handleChange}
                    className="w-full border-2 border-primary rounded-md px-4 py-3 text-ink bg-surface
                               appearance-none cursor-pointer font-medium
                               focus:outline-none focus:border-primary-hover transition-colors"
                    required
                  >
                    <option value="" disabled>Select range</option>
                    {STAFF_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
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
          </div>
          <div className="border-t border-border-dim pt-6 mb-6">
            <h2 className="text-sm font-semibold text-ink mb-3 uppercase tracking-wide">
              Primary Markets Covered
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {MARKET_OPTIONS.map((market) => {
                const isSelected = form.markets_covered.includes(market);
                return (
                  <button
                    key={market}
                    type="button"
                    onClick={() => toggleMarket(market)}
                    className={`px-4 py-2 text-sm border rounded-md transition-colors cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-ink hover:border-border-dim"
                    }`}
                  >
                    {market}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border-dim pt-6 mb-8">
            <h2 className="text-sm font-semibold text-ink mb-4 uppercase tracking-wide">
              Statutory Document Uploads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full border border-dashed border-border-dim rounded-md px-4 py-4 flex items-center justify-center bg-surface cursor-pointer hover:bg-ground transition-colors">
                <span className="text-sm font-medium text-ink-dim text-center">Certificate of Incorporation / BRS Extract</span>
              </div>
              <div className="w-full border border-dashed border-border-dim rounded-md px-4 py-4 flex items-center justify-center bg-surface cursor-pointer hover:bg-ground transition-colors">
                <span className="text-sm font-medium text-ink-dim text-center">KRA Tax Compliance Certificate</span>
              </div>
            </div>
          </div>

          {/* Final Submit Button */}
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
              Continue to Settlement & Rates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
