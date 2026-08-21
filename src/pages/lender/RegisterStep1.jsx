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
          {/* We will add form fields here next! */}
        </form>

      </div>
    </div>
  );
}
