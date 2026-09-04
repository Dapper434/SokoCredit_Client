import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { marketOptions, turnoverRanges } from "../../data/mockCustomerData";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";
import { useSessionState } from "../../hooks/useSessionState";

export default function CustomerOnboardStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName = "", idNumber = "", dob = "", gender = "", mpesaPhone = "", pin = "", lendingInstitutionId = "", branchId = "" } = location.state || {};

  const [businessName, setBusinessName] = useSessionState("cus_businessName", "");
  const [market, setMarket] = useSessionState("cus_market", "");
  const [stall, setStall] = useSessionState("cus_stall", "");
  const [turnover, setTurnover] = useSessionState("cus_turnover", "");
  const [kinName, setKinName] = useSessionState("cus_kinName", "");
  const [kinPhone, setKinPhone] = useSessionState("cus_kinPhone", "");
  const [kinEmail, setKinEmail] = useSessionState("cus_kinEmail", "");
  const [residentialAddress, setResidentialAddress] = useSessionState("cus_residentialAddress", "");

  const isValid = businessName.trim() !== "" && market.trim() !== "";

   const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/customer/creditcheck", { 
      state: { 
        fullName, idNumber, dob, gender, mpesaPhone, pin, lendingInstitutionId, branchId,
        businessName, market, stall, turnover, residentialAddress, kinName, kinPhone, kinEmail
      } 
    });
  };
    return (
    <CustomerAuthFrame>
      <div className="flex flex-col md:flex-row min-h-full flex-1">
      <div className="bg-primary px-6 pt-8 pb-10 md:w-2/5 md:min-h-screen md:flex md:flex-col md:justify-center md:px-12 lg:px-16 md:py-0">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            type="button"
            onClick={() => navigate("/customer/onboarding/1")}
            className="text-white/70 text-sm flex items-center gap-1.5 hover:text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <span className="text-xs text-white/60 font-mono">Step 2 of 2</span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full mb-5 md:mb-8 md:max-w-xs">
          <div className="h-full w-full bg-white rounded-full" />
        </div>
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-3">Business & Credit</h1>
        <p className="text-sm md:text-base lg:text-lg text-white/70">Tell us about your business</p>
      </div>
       <form
        onSubmit={handleSubmit}
        className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-6 pt-8 pb-6 flex flex-col gap-4
           md:w-3/5 md:mt-0 md:rounded-none md:overflow-y-auto md:flex md:flex-col md:justify-center md:items-center md:px-12 lg:px-16 md:py-16"
      >
        <div className="w-full md:max-w-lg flex flex-col gap-4 mx-auto md:mx-0">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Business / Stall Name</label>
  <input
            type="text"
            placeholder="e.g. Mama Aisha Vegetables"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Market</label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="w-full px-3 py-3 rounded-md border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select market</option>
              {marketOptions.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Stall Number</label>
            <input
              type="text"
              placeholder="e.g. A-24"
              value={stall}
              onChange={(e) => setStall(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Monthly Turnover</label>
          <select
            value={turnover}
            onChange={(e) => setTurnover(e.target.value)}
            className="w-full px-3 py-3 rounded-md border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select range</option>
            {turnoverRanges.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Residential Address</label>
          <input
            type="text"
            placeholder="e.g. 123 Main St, Apartment 4B"
            value={residentialAddress}
            onChange={(e) => setResidentialAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
         <div className="pt-1 border-t border-border">
          <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-3 mt-3">Next of Kin</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Full Name</label>
                <input
                type="text"
                placeholder="Name"
                value={kinName}
                onChange={(e) => setKinName(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
                </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                placeholder="07XX XXX XXX"
                value={kinPhone}
                onChange={(e) => setKinPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                placeholder="Next of Kin Email"
                value={kinEmail}
                onChange={(e) => setKinEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
 <div className="mt-2">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3.5 rounded-md font-semibold text-sm transition-all ${
              !isValid ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            Submit Application
          </button>
        </div>
        </div>
      </form>
      </div>
    </CustomerAuthFrame>
  );
}