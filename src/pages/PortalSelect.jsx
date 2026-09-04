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

      {/* Portal Selection Cards */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        
        {/* 1. Customer Portal (Currently disabled as it's a future feature) */}
        {/* 1. Customer Portal — routes to sign in */}
          <button
            onClick={() => navigate("/customer/signin")}
            className="group w-full flex items-center justify-between px-6 py-5 rounded-xl
             bg-white/8 border border-white/15 text-left
             hover:bg-white/12 hover:border-white/25
             cursor-pointer transition-all duration-200"
          >
          <div>
            <p className="text-white font-semibold text-base">
              Customer Portal
            </p>
            <p className="text-white/50 text-sm mt-0.5">
              Borrowers — apply, track, repay loans
            </p>
          </div>
          {/* Mobile indicator tag */}
          <div className="flex items-center gap-2 text-white/50 group-hover:text-white/70 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </button>

        {/* 2. Lender Portal (Active - routes to sign in) */}
        <button
          onClick={() => navigate("/lender/signin")}
          className="group w-full flex items-center justify-between px-6 py-5 rounded-xl
                     bg-white/8 border border-white/15 text-left
                     hover:bg-white/12 hover:border-white/25
                     cursor-pointer transition-all duration-200"
        >
          <div>
            <p className="text-white font-semibold text-base">Lender Portal</p>
            <p className="text-white/50 text-sm mt-0.5">
              Institution staff — manage, approve, track
            </p>
          </div>
          {/* Desktop indicator tag */}
          <div className="flex items-center gap-2 text-white/50 group-hover:text-white/70 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </button>
      </div>

      {/* Footer text */}
      <p className="text-white/30 text-xs mt-12 tracking-wide italic">
        Version 1.3 MVP · Nairobi Microfinance Platform
      </p>

    </div>
  );
}
