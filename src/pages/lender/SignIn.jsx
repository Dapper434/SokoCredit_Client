import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/shared/Toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const { toast, ToastContainer } = useToast();

  const navigate = useNavigate();

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast("Invalid email format", "error");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await apiLogin(email.trim(), password);
      // Ensure we destructure token and user from response
      // Assuming response has { token, user } directly based on backend contract
      const { token, user } = response;
      
      login(token, user);
      
      if (user.role === 'branch_manager') {
        navigate('/lender/command-center', { replace: true });
      } else if (user.role === 'loan_officer') {
        navigate('/lender/operations', { replace: true });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Main full-height container with a light background
    <div className="min-h-screen bg-ground flex flex-col px-4 py-6">
      {/* Back navigation link positioned at the top left */}
      <div className="w-full max-w-md mx-auto mb-10">
        <button
          onClick={() => navigate("/")}
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
        >
          ← Back to portals
        </button>
      </div>

      {/* Container for the page content, allowing us to center it */}
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-md">
          {/* Header section with brand text and page title */}
          <p className="text-xs tracking-[0.2em] text-accent uppercase font-semibold mb-2">
            SokoCredit
          </p>
          <h1 className="text-3xl font-bold text-ink mb-1">Lender Portal</h1>
          <p className="text-ink-muted text-sm mb-6">Staff sign-in</p>

          {/* Authentication Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-border-dim rounded-lg p-6"
          >
            {/* Email Input Field */}
            <label className="block text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">
              STAFF EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="w-full border border-border rounded-md px-4 py-3 mb-5 text-ink
                         placeholder:text-ink-muted/50 bg-transparent
                         focus:outline-none focus:border-primary transition-colors"
              required
            />

            {/* Password Input Field */}
            <label className="block text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">
              PASSWORD
            </label>
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum of 8 characters"
                className="w-full border border-border rounded-md px-4 py-3 pr-12 text-ink
                           placeholder:text-ink-muted/50 bg-transparent
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

            {error && (
              <div className="bg-status-overdue-bg border border-status-overdue-border text-status-overdue-text text-sm rounded-md px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full font-semibold py-3 rounded-md transition-all duration-200
                ${
                  isFormValid && !submitting
                    ? "bg-primary hover:bg-primary-hover text-white cursor-pointer"
                    : "bg-ground-dim text-ink-muted cursor-not-allowed"
                }`}
            >
              {submitting ? "Authenticating..." : "Sign In to Portal"}
            </button>

            <p className="text-center text-xs text-ink-muted mt-4">
              Staff accounts are provisioned internally by your institution administrator.
            </p>
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
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}