import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "../../components/otp/OtpInput";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "07XX XXX XXX";

  const handleVerify = () => {
    navigate("/customer/onboarding/1");
  };

  return (
    <CustomerAuthFrame>
      <div className="flex flex-col lg:flex-row min-h-full">
        <div className="bg-primary px-6 pt-10 pb-12 lg:w-2/5 lg:min-h-screen lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-0">
          <button
            onClick={() => navigate("/customer/signin")}
            className="text-white/70 text-sm flex items-center gap-1.5 mb-6 hover:text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-3">Enter OTP</h1>
          <p className="text-sm lg:text-lg text-white/70">Code sent to {phone}</p>
        </div>

        <div
          className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-6 pt-8 pb-6 flex flex-col gap-8
                     lg:w-3/5 lg:mt-0 lg:rounded-none lg:flex lg:flex-col lg:justify-center lg:items-center lg:px-16 lg:py-16"
        >
          <div className="w-full lg:max-w-sm flex flex-col gap-8">
            <OtpInput length={6} onComplete={() => {}} />

            <button
              onClick={handleVerify}
              className="w-full py-3.5 rounded-md font-semibold text-sm bg-primary text-white hover:bg-primary-hover active:scale-[0.99] transition-all"
            >
              Verify Code
            </button>

            <p className="text-center text-xs text-ink-muted">
              Did not receive it?{" "}
              <button className="text-primary font-semibold underline underline-offset-2">Resend</button>
            </p>
          </div>
        </div>
      </div>
    </CustomerAuthFrame>
  );
}
