import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";
import { customerLogin, saveSession, apiRequest } from "../../lib/api";

export default function CustomerSignIn() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [lendingInstitutionId, setLendingInstitutionId] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest("/api/origination/institutions")
      .then((data) => setInstitutions(data))
      .catch((err) => console.error("Failed to fetch institutions", err));
  }, []);

  const isFormValid = phone.trim() !== "" && pin.trim().length >= 5 && lendingInstitutionId !== "";

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    
    setSubmitting(true);
    setError("");
    
    try {
      const data = await customerLogin(phone, pin, lendingInstitutionId);
      // Backend returns { access_token, customer_profile_id, full_name, phone_number, role }
      saveSession(data.access_token, {
        full_name: data.full_name,
        customer_profile_id: data.customer_profile_id,
        phone_number: data.phone_number,
        national_id_number: data.national_id_number,
        role: data.role,
      });
      navigate("/customer/hub");
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("invalid phone number")) {
        setError("Account not found or invalid PIN. Please register first.");
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerAuthFrame>
      <div className="flex flex-col md:flex-row min-h-full flex-1">
        {/* Hero panel — left column on desktop, top banner on mobile */}
        <div className="bg-primary px-6 pt-10 pb-12 md:w-2/5 md:min-h-screen md:flex md:flex-col md:justify-center md:px-12 lg:px-16 md:py-0">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-white/10 flex items-center justify-center mb-5 md:mb-8">
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 md:w-9 md:h-9">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-3">Welcome back</h1>
          <p className="text-sm md:text-base lg:text-lg text-white/70">Sign in to your SokoCredit account</p>
        </div>

        {/* Form panel — right column on desktop, stacked below on mobile */}
        <form
          onSubmit={handleSignIn}
          className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-6 pt-8 pb-6 flex flex-col gap-5
                     md:w-3/5 md:mt-0 md:rounded-none md:flex md:flex-col md:justify-center md:px-12 lg:px-16 md:py-16"
        >
          <div className="w-full md:max-w-md flex flex-col gap-5 mx-auto md:mx-0">
            {error && (
              <div className="bg-status-missed-bg text-status-missed-text text-sm p-3 rounded border border-status-missed-border">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Institution</label>
              <select
                value={lendingInstitutionId}
                onChange={(e) => setLendingInstitutionId(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select your institution</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">PIN</label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink"
                >
                  {showPin ? (
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
              <p className="text-[11px] text-ink-muted">PIN must be at least 5 characters.</p>
            </div>

            <button type="button" className="text-xs text-primary font-semibold self-start underline underline-offset-2 mt-1">
              Forgot PIN?
            </button>

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full py-3.5 rounded-md font-semibold text-sm transition-all ${
                (!isFormValid || submitting)
                  ? "bg-border text-ink-muted cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
              }`}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-xs text-ink-muted">
              New borrower?{" "}
              <button
                type="button"
                onClick={() => navigate("/customer/onboarding/1")}
                className="text-primary font-semibold underline underline-offset-2"
              >
                Create account
              </button>
            </p>
          </div>
        </form>
      </div>
    </CustomerAuthFrame>
  );
}