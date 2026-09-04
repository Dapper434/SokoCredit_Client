import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerCreditCheck() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    let p = 0;
    const interval = setInterval(() => {
      p += 12;
      setProgress((prev) => Math.min(prev + 12, 90)); // Cap at 90% until API resolves
    }, 400);

    async function registerUser() {
      try {
        const { customerRegister, customerLogin, saveSession, clearCustomerOnboardingSession } = await import("../../lib/api");
        
        // Map frontend fields to backend schema
        const payload = {
          full_name: formData.fullName,
          national_id_number: formData.idNumber,
          phone_number: formData.mpesaPhone,
          pin: formData.pin,
          lending_institution_id: Number(formData.lendingInstitutionId),
          branch_id: formData.branchId ? Number(formData.branchId) : null,
          date_of_birth: formData.dob || null,
          gender: formData.gender || null,
          business_type: formData.businessName || null,
          monthly_income_range: formData.turnover || null,
          residential_address: formData.residentialAddress || null,
          next_of_kin_name: formData.kinName || null,
          next_of_kin_phone: formData.kinPhone || null,
          next_of_kin_email: formData.kinEmail || null,
          market_name: formData.market || null,
          stall_number: formData.stall || null,
        };
        
        await customerRegister(payload);
        
        // If successful, log them in
        const session = await customerLogin(payload.phone_number, payload.pin, payload.lending_institution_id);
        // Backend returns { access_token, customer_profile_id, full_name, phone_number, role }
        saveSession(session.access_token, {
          full_name: session.full_name || payload.full_name,
          customer_profile_id: session.customer_profile_id,
          phone_number: session.phone_number,
          national_id_number: session.national_id_number,
          role: session.role,
        });
        
        clearCustomerOnboardingSession();
        
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => navigate("/customer/hub"), 600);
        
      } catch (err) {
        clearInterval(interval);
        setError(err.message || "Registration failed. Please try again.");
      }
    }
    
    registerUser();
    
    return () => clearInterval(interval);
  }, [navigate, formData]);

  return (
    <CustomerAuthFrame>
      <div className="flex flex-col items-center justify-center min-h-full px-8 py-12 bg-ground text-center gap-8 md:gap-10">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-primary-light flex items-center justify-center relative">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-9 h-9 md:w-12 md:h-12 text-primary" stroke="currentColor">
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
          <h2 className="text-xl md:text-3xl font-bold text-ink mb-2 md:mb-3">Checking your SokoCredit history</h2>
          <p className="text-sm md:text-base text-ink-muted leading-relaxed max-w-xs md:max-w-md mx-auto">
            We review your loan and repayment history across all SokoCredit lenders — no third-party bureau is involved.
          </p>
        </div>

        {error ? (
          <div className="w-full max-w-xs md:max-w-sm mt-4 p-4 rounded bg-status-missed-bg border border-status-missed-text/20">
            <p className="text-status-missed-text text-sm font-semibold mb-3">{error}</p>
            <button 
              onClick={() => navigate("/customer/onboarding/1")}
              className="px-4 py-2 bg-ground border border-border rounded text-ink-dim text-sm font-medium hover:bg-surface transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs md:max-w-sm">
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
        )}
      </div>
    </CustomerAuthFrame>
  );
}
