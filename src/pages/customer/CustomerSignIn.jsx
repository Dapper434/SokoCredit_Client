import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerSignIn() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const isFormValid = phone.trim() !== "" && pin.trim() !== "";

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    navigate("/customer/otp", { state: { phone } });
  };

  return (
    <CustomerAuthFrame>
      <div className="flex flex-col lg:flex-row min-h-full">
        {/* Hero panel — left column on desktop, top banner on mobile */}
        <div className="bg-primary px-6 pt-10 pb-12 lg:w-2/5 lg:min-h-screen lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-0">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg bg-white/10 flex items-center justify-center mb-5 lg:mb-8">
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 lg:w-9 lg:h-9">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-3">Welcome back</h1>
          <p className="text-sm lg:text-lg text-white/70">Sign in to your SokoCredit account</p>
        </div>

        {/* Form panel — right column on desktop, stacked below on mobile */}
        <form
          onSubmit={handleSignIn}
          className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-6 pt-8 pb-6 flex flex-col gap-5
                     lg:w-3/5 lg:mt-0 lg:rounded-none lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-16"
        >
          <div className="w-full lg:max-w-sm flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Phone or Email</label>
              <input
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">PIN / Password</label>
              <input
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <button type="button" className="text-xs text-primary font-semibold self-start underline underline-offset-2">
              Forgot PIN?
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3.5 rounded-md font-semibold text-sm transition-all ${
                !isFormValid
                  ? "bg-border text-ink-muted cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
              }`}
            >
              Sign In
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