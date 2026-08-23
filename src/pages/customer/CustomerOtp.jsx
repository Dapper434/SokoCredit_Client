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