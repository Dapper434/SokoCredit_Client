import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerCreditCheck() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 12;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => navigate("/customer/hub"), 600);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <CustomerAuthFrame>
      <div className="flex flex-col items-center justify-center min-h-full px-8 py-12 bg-ground text-center gap-8 lg:gap-10">
        <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full border-4 border-primary-light flex items-center justify-center relative">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-9 h-9 lg:w-12 lg:h-12 text-primary" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <svg className="absolute -inset-0.5 text-primary" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${(progress / 100) * 125.6} 125.6`}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
              className="transition-all duration-300"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-xl lg:text-3xl font-bold text-ink mb-2 lg:mb-3">Checking your SokoCredit history</h2>
          <p className="text-sm lg:text-base text-ink-muted leading-relaxed max-w-xs lg:max-w-md mx-auto">
            We review your loan and repayment history across all SokoCredit lenders — no third-party bureau is involved.
          </p>
        </div>

        <div className="w-full max-w-xs lg:max-w-sm">
          <div className="flex justify-between text-[11px] font-mono text-ink-muted mb-2">
            <span>Running internal reference check</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-border-dim rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </CustomerAuthFrame>
  );
}
