import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/lender/mfa");
  };

  return (
    <div className="min-h-screen bg-ground flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="text-ink-muted text-sm mb-8 flex items-center gap-2 hover:text-ink"
        >
          ← Back to portals
        </button>

        <p className="text-xs tracking-widest text-ink-muted uppercase mb-2">
          SokoCredit
        </p>
        <h1 className="text-3xl font-bold text-ink mb-1">Lender Portal</h1>
        <p className="text-ink-dim mb-8">Staff sign-in</p>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-lg p-6"
        >
          <label className="block text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-border rounded-md px-4 py-3 mb-5 text-ink focus:outline-none focus:border-primary"
            required
          />

          <label className="block text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border rounded-md px-4 py-3 mb-6 text-ink focus:outline-none focus:border-primary"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-md transition-colors"
          >
            Continue to Verification
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          Registering a new institution?{" "}
          <a href="#" className="text-primary font-semibold underline">
            Begin onboarding
          </a>
        </p>
      </div>
    </div>
  );
}