import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { marketOptions, turnoverRanges } from "../../data/mockCustomerData";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerOnboardStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = location.state?.fullName || "";

  const [businessName, setBusinessName] = useState("");
  const [market, setMarket] = useState("");
  const [stall, setStall] = useState("");
  const [turnover, setTurnover] = useState("");
  const [kinName, setKinName] = useState("");
  const [kinPhone, setKinPhone] = useState("");

  const isValid = businessName.trim() !== "" && market.trim() !== "";

   const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/customer/creditcheck", { state: { fullName } });
  };
    return (
    <CustomerAuthFrame>
      <div className="flex flex-col lg:flex-row min-h-full">
      <div className="bg-primary px-6 pt-8 pb-10 lg:w-2/5 lg:min-h-screen lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-0">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <button
            onClick={() => navigate("/customer/onboarding/1")}
            className="text-white/70 text-sm flex items-center gap-1.5 hover:text-white"
          ></button>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <span className="text-xs text-white/60 font-mono">Step 2 of 2</span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full mb-5 lg:mb-8 lg:max-w-xs">
          <div className="h-full w-full bg-white rounded-full" />
        </div>
        <h1 className="text-xl lg:text-4xl font-bold text-white mb-1 lg:mb-3">Business & Credit</h1>
        <p className="text-sm lg:text-lg text-white/70">Tell us about your business</p>
      </div>
