import { useNavigate } from "react-router-dom";

export default function PortalSelect() {
  const navigate = useNavigate();

  return (
    // Main full-screen wrapper with the dark green portal background
    <div className="min-h-screen bg-portal-bg flex flex-col items-center justify-center px-4">
      
      {/* Brand logo and platform title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 border border-white/15 mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          SokoCredit
        </h1>
        <p className="text-white/60 mt-2 text-sm">
          Microfinance loan management platform
        </p>
      </div>

    </div>
  );
}
