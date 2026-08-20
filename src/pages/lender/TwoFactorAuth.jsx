import { useNavigate } from "react-router-dom";
import OtpInput from "../../components/otp/OtpInput";

export default function TwoFactorAuth() {
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate("/lender/dashboard");
  };

  return (
    <div className="min-h-screen bg-ground flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="text-ink-muted text-sm mb-2 flex items-center gap-2 hover:text-ink"
        >
          ← Back to portals
        </button>
        <button
          onClick={() => navigate("/lender/signin")}
          className="text-ink-muted text-sm mb-8 flex items-center gap-2 hover:text-ink"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-ink mb-2">
          Two-Factor Authentication
        </h1>
        <p className="text-ink-dim mb-8">
          Required second step. Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-ink">oman@gmail.com</span>.
        </p>

        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="mb-6">
            <OtpInput length={6} onComplete={() => {}} />
          </div>

          <div className="bg-status-due-bg border border-status-due-border text-status-due-text text-sm rounded-md px-4 py-3 mb-6">
            MFA is mandatory for all staff logins.
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-md transition-colors"
          >
            Verify & Sign In
          </button>
        </div>
      </div>
    </div>
  );
}