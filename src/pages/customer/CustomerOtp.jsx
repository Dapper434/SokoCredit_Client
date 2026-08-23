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
      <div className="flex flex-col min-h-full">
        <div className="bg-primary px-6 pt-10 pb-12">
          <button
            onClick={() => navigate("/customer/signin")}
            className="text-white/70 text-sm flex items-center gap-1.5 mb-6 hover:text-white"
          ></button>