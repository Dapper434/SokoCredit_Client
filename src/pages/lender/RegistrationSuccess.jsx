import { useNavigate } from "react-router-dom";

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ground px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-lg bg-surface border border-border-dim rounded-2xl p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-status-active-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-status-active-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4 tracking-tight">
          Application Received
        </h1>
        
        <p className="text-sm md:text-base text-ink-dim leading-relaxed mb-8">
          Your submission has been successfully received and will be reviewed by the SokoCredit compliance team within <span className="font-semibold text-ink">36 hours</span>. 
          Once verified, your institution's Maker-Checker desk will be activated.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-ink-muted hover:text-primary transition-colors font-medium flex items-center justify-center gap-1.5 mt-2"
          >
            ← Back to Portals Menu
          </button>
        </div>
      </div>
    </div>
  );
}
