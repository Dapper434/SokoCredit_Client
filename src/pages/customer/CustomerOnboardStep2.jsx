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
