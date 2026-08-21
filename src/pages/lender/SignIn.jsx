import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  // State to hold the user's input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  // Simple validation: Ensure neither field is left empty
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // Process the sign-in when the user submits the form
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (!isFormValid) return; // Block submission if invalid
    
    // In a real app we'd call an API here. For now, navigate to the next step
    navigate("/lender/mfa");
  };

  return (
    // Main full-height container with a light background
    <div className="min-h-screen bg-ground flex flex-col px-4 pt-6">
      
      {/* Back navigation link positioned at the top left */}
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
        >
          ← Back to portals
        </button>
      </div>

      {/* Container for the page content, allowing us to center it */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="w-full max-w-md">
          {/* Header section with brand text and page title */}
          <p className="text-xs tracking-[0.2em] text-accent uppercase font-semibold mb-2">
            SokoCredit
          </p>
          <h1 className="text-3xl font-bold text-ink mb-1">Lender Portal</h1>
          <p className="text-ink-muted text-sm mb-8">Staff sign-in</p>

          {/* Authentication Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-border-dim rounded-lg p-6"
          >
            {/* Email Input Field */}
            <label className="block text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@institution.co.ke"
              className="w-full border border-border rounded-md px-4 py-3 mb-5 text-ink
                         placeholder:text-ink-muted/50 bg-transparent
                         focus:outline-none focus:border-primary transition-colors"
              required
            />

            {/* Password Input Field */}
            <label className="block text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-border rounded-md px-4 py-3 mb-6 text-ink
                         placeholder:text-ink-muted/50 bg-transparent
                         focus:outline-none focus:border-primary transition-colors"
              required
            />

            {/* Submit Button (Disables automatically if form is invalid) */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full font-semibold py-3 rounded-md transition-all duration-200
                ${
                  isFormValid
                    ? "bg-primary hover:bg-primary-hover text-white cursor-pointer"
                    : "bg-ground-dim text-ink-muted cursor-not-allowed"
                }`}
            >
              Continue to Verification
            </button
          </form>

          {/* Registration link below the form for new institutions */}
          <p className="text-center text-sm text-ink-muted mt-6">
            Registering a new institution?{" "}
            <button
              onClick={() => navigate("/lender/register")}
              className="text-primary font-semibold underline underline-offset-2 hover:text-primary-hover transition-colors cursor-pointer"
            >
              Begin onboarding
            </button>
          </p
        </div>
      </div>
      
    </div>
  );
}