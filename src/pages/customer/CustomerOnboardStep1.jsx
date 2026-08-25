import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerOnboardStep1() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const isValid = fullName.trim() !== "" && idNumber.trim() !== "";

  const handleContinue = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/customer/onboarding/2", { state: { fullName } });
  };

   return (
    <CustomerAuthFrame>
      <div className="flex flex-col lg:flex-row min-h-full">
        <div className="bg-primary px-6 pt-8 pb-10 lg:w-2/5 lg:min-h-screen lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-0">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <button
              onClick={() => navigate("/customer/signin")}
              className="text-white/70 text-sm flex items-center gap-1.5 hover:text-white"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <span className="text-xs text-white/60 font-mono">Step 1 of 2</span>
          </div>
          <div className="w-full h-1 bg-white/20 rounded-full mb-5 lg:mb-8 lg:max-w-xs">
            <div className="h-full w-1/2 bg-white rounded-full" />
          </div>
          <h1 className="text-xl lg:text-4xl font-bold text-white mb-1 lg:mb-3">Personal Identity</h1>
          <p className="text-sm lg:text-lg text-white/70">Required for account verification</p>
        </div>

  <form
          onSubmit={handleContinue}
          className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-6 pt-8 pb-6 flex flex-col gap-4
                     lg:w-3/5 lg:mt-0 lg:rounded-none lg:overflow-y-auto lg:flex lg:flex-col lg:items-center lg:px-16 lg:py-16"
        ></form>
          <div className="w-full lg:max-w-md flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Full Legal Name</label>
              <input
                type="text"
                placeholder="As on National ID"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
              <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">National ID Number</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 12345678"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
              <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}