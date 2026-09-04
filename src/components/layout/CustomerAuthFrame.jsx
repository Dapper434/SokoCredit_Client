import { useNavigate } from "react-router-dom";

// Wraps every pre-login Customer Portal screen (sign in, OTP, onboarding,
// credit check) in the same phone-frame shell used post-login, minus the
// bottom nav (which shouldn't show before the borrower is authenticated).
// Matches the Figma reference App.tsx's inline wrapper around AuthFlow.
export default function CustomerAuthFrame({ children }) {
  const navigate = useNavigate();

  return (
    // Full-height page background — completely fluid to support split panels 
    // at the md breakpoint for better split-screen scaling.
    <div className="min-h-screen bg-ground flex flex-col w-full">
      <div className="relative w-full flex flex-col min-h-screen mx-auto">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate("/")}
            className="text-white/70 text-xs flex items-center gap-1 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Portals
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
