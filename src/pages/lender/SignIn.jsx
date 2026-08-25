import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveSession } from "../../lib/api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Backend doesn't return a staff role yet, so this toggle lets us
  // demo both RBAC views until real role data comes from login.
  const [selectedRole, setSelectedRole] = useState("branch_manager");

  const navigate = useNavigate();

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      // Check the staff roster saved by StaffAccess
      const staffList = JSON.parse(localStorage.getItem("sokocredit_staff_roster") || "[]");
      const staffMember = staffList.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      
      if (staffMember && staffMember.status === "inactive") {
        throw new Error("Your account has been deactivated. Please contact your administrator.");
      }

      if (staffMember) {
        // Staff member found in roster — validate their password
        if (staffMember.password !== password) {
          throw new Error("Invalid email or password.");
        }

        // Enforce role gate — must match the selected login tab
        if (staffMember.role !== selectedRole) {
          const expected = staffMember.role === "loan_officer" ? "Loan Officer" : "Branch Manager";
          throw new Error(`This account is registered as a ${expected}. Please use the correct sign-in tab.`);
        }

        // Auto-activate on first successful login if still "invited"
        if (staffMember.status === "invited") {
          staffMember.status = "active";
          staffMember.lastActive = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
          localStorage.setItem("sokocredit_staff_roster", JSON.stringify(staffList));
        }

        // Build session from the roster data (real staff login)
        saveSession({
          role: staffMember.role,
          user: {
            id: staffMember.id,
            email: staffMember.email,
            name: staffMember.name,
            role: staffMember.role,
          },
          token: "roster-auth-" + staffMember.id,
        });
        navigate("/lender/mfa");
      } else {
        // Not in roster — fall back to mock API login (super admin / signup flow)
        const data = await login(email.trim(), password);
        saveSession({ role: selectedRole, ...data });
        navigate("/lender/mfa");
      }
    } catch (err) {
      setError(err.message);
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

          {/* Role toggle — Branch Manager vs Loan Officer */}
          <div className="flex rounded-md border border-border overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole("branch_manager")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                selectedRole === "branch_manager"
                  ? "bg-ink text-white"
                  : "bg-surface text-ink-dim hover:bg-ground"
              }`}
            >
              Branch Manager
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("loan_officer")}
              className={`flex-1 py-2.5 text-sm font-semibold border-l border-border transition-colors ${
                selectedRole === "loan_officer"
                  ? "bg-ink text-white"
                  : "bg-surface text-ink-dim hover:bg-ground"
              }`}
            >
              Loan Officer
            </button>
          </div>

          {/* Authentication Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-border-dim rounded-lg p-6"
          >
            {/* Email Input Field */}
            <label className="block text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@institution.co.ke"
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
              {submitting ? "Signing in…" : "Continue to Verification (MFA)"}
            </button>

            <p className="text-center text-xs text-ink-muted mt-4">
              Staff accounts are provisioned internally by your institution admin.
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
    </div>
  );
}