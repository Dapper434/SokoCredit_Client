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
          {/* We will add form fields here next! */}
        </form>
      </div>
    </div>
  );
}
