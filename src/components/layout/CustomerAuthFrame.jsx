import { useNavigate } from "react-router-dom";

// Wraps every pre-login Customer Portal screen (sign in, OTP, onboarding,
// credit check) in the same phone-frame shell used post-login, minus the
// bottom nav (which shouldn't show before the borrower is authenticated).
// Matches the Figma reference App.tsx's inline wrapper around AuthFlow.
export default function CustomerAuthFrame({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary p-0 sm:p-6">
      <div className="relative w-full sm:w-[390px] sm:max-h-[844px] bg-ground sm:rounded-[32px] sm:overflow-hidden sm:shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:h-[844px]">
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
