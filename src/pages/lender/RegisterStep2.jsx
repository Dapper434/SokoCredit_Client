import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STAFF_RANGES = ["1-5", "6-15", "16-30", "31-60", "60+"];
const MARKET_OPTIONS = ["Toi Market", "Muthurwa", "Gikomba", "Kangemi", "Wakulima", "Other"];

export default function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();

  const step1Data = location.state?.step1 || {};

  const [form, setForm] = useState({
    county_business_permit: "",
    odpc_registration_number: "",
    director_full_name: "",
    director_national_id: "",
    official_work_email: "",
    estimated_staff: "",
    markets_covered: [],
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
          onClick={() => navigate("/lender/register")}
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
