import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";
import { useSessionState } from "../../hooks/useSessionState";
import { apiRequest } from "../../lib/api";

export default function CustomerOnboardStep1() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useSessionState("cus_fullName", "");
  const [idNumber, setIdNumber] = useSessionState("cus_idNumber", "");
  const [dob, setDob] = useSessionState("cus_dob", "");
  const [gender, setGender] = useSessionState("cus_gender", "");
  const [mpesaPhone, setMpesaPhone] = useSessionState("cus_mpesaPhone", "");
  const [pin, setPin] = useSessionState("cus_pin", "");
  const [lendingInstitutionId, setLendingInstitutionId] = useSessionState("cus_lendingInstitutionId", "");
  const [branchId, setBranchId] = useSessionState("cus_branchId", "");
  const [institutions, setInstitutions] = useState([]);
  const [showPin, setShowPin] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useSessionState("cus_photoUploaded", false);

  useEffect(() => {
    apiRequest("/api/origination/institutions")
      .then((data) => setInstitutions(data))
      .catch((err) => console.error("Failed to fetch institutions", err));
  }, []);

  const selectedInstitution = institutions.find(inst => inst.id === Number(lendingInstitutionId));
  const branches = selectedInstitution ? selectedInstitution.branches : [];

  // Validate pin is at least 5 chars and numbers only
  const isPinValid = pin.trim().length >= 5 && /^\d+$/.test(pin);
  const isValid = fullName.trim() !== "" && idNumber.trim() !== "" && mpesaPhone.trim() !== "" && isPinValid && lendingInstitutionId !== "";

  const handleContinue = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/customer/onboarding/2", { 
      state: { fullName, idNumber, dob, gender, mpesaPhone, pin, lendingInstitutionId, branchId } 
    });
  };

   return (
    <CustomerAuthFrame>
      <div className="flex flex-col md:flex-row min-h-full flex-1">
        <div className="bg-primary px-6 pt-8 pb-10 md:w-2/5 md:min-h-screen md:flex md:flex-col md:justify-center md:px-12 lg:px-16 md:py-0">
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
          <div className="w-full h-1 bg-white/20 rounded-full mb-5 md:mb-8 md:max-w-xs">
            <div className="h-full w-1/2 bg-white rounded-full" />
          </div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-3">Personal Identity</h1>
          <p className="text-sm md:text-base lg:text-lg text-white/70">Required for account verification</p>
        </div>

  <form
          onSubmit={handleContinue}
          className="flex-1 bg-ground rounded-t-[20px] -mt-4 px-6 pt-8 pb-6 flex flex-col gap-4
                     md:w-3/5 md:mt-0 md:rounded-none md:overflow-y-auto md:flex md:flex-col md:justify-center md:items-center md:px-12 lg:px-16 md:py-16"
        >
          <div className="w-full md:max-w-lg flex flex-col gap-4 mx-auto md:mx-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Institution</label>
                <select
                  value={lendingInstitutionId}
                  onChange={(e) => {
                    setLendingInstitutionId(e.target.value);
                    setBranchId("");
                  }}
                  className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Institution</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Branch</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  disabled={!lendingInstitutionId}
                  className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                >
                  <option value="">Select Branch (Optional)</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-3 rounded-md border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-3 rounded-md border border-border text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">M-Pesa Phone Number</label>
                <input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-[11px] text-ink-muted">Must match registered M-Pesa line</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Login PIN</label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Minimum 5 digits"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 pr-12 rounded-md border border-border text-sm font-medium text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary tracking-[0.2em]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink"
                  >
                    {showPin ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.28 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-ink-muted">PIN must be at least 5 characters.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-dim uppercase tracking-wide">Profile Photo</label>
              <button
                type="button"
                onClick={() => setPhotoUploaded(true)}
                className={`w-full py-4 rounded-md border-2 border-dashed text-sm font-medium transition-colors ${
                  photoUploaded
                    ? "border-status-paid-text bg-status-paid-bg text-status-paid-text"
                    : "border-border bg-surface text-ink-muted hover:border-primary hover:text-primary"
                }`}
              >
                {photoUploaded ? "Photo uploaded" : "Tap to take photo or choose from gallery"}
              </button>
              <p className="text-[11px] text-ink-muted">Stored securely — no automated face matching.</p>
            </div>
            <div className="mt-2">
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full py-3.5 rounded-md font-semibold text-sm transition-all ${
                  !isValid ? "bg-border text-ink-muted cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </CustomerAuthFrame>
  );
}