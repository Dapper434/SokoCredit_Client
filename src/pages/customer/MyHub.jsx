import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { borrowerProfile, repaymentDiscipline } from "../../data/mockCustomerData";
import {
  getSession, getCheckins, getMyLoans, getAvailableCredit, getMyProfile,
  initiateSavingsStk, getSavingsDepositStatus, simulateMpesaCallback,
} from "../../lib/api";

const TIER_STYLES = {
  A: "bg-primary",
  B: "bg-status-due-text",
  C: "bg-ink-muted",
};

const TIER_LABELS = {
  A: "Excellent standing",
  B: "Good standing",
  C: "Building credit",
};

export default function MyHub() {
  const navigate = useNavigate();
  const session = getSession();
  const fullName = session?.user?.full_name || "Customer";
  const firstName = fullName.split(" ")[0];

  // ── Check-in state (from backend) ──────────────────────────────────
  const [checkinData, setCheckinData] = useState({
    count: 0, goal: 14, dates: [], gate_complete: false, checked_in_today: false,
    soko_points_total: 0,
  });
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinError, setCheckinError] = useState("");

  const [actualAvailableCredit, setActualAvailableCredit] = useState(0);

  // Credit tier from the customer's own profile, so this matches Profile Center.
  const [profileTier, setProfileTier] = useState(null);

  // ── Loan state (to derive journey progress) ────────────────────────
  const [loans, setLoans] = useState([]);
  const [loansLoaded, setLoansLoaded] = useState(false);

  useEffect(() => {
    // Load check-in history
    getCheckins()
      .then(setCheckinData)
      .catch(() => {}); // Silently fail if not logged in yet

    // Load loans to derive journey step 3+4
    getMyLoans()
      .then((data) => { setLoans(data); setLoansLoaded(true); })
      .catch(() => setLoansLoaded(true));
      
    // Load actual available credit
    if (session?.user?.customer_profile_id) {
      getAvailableCredit(session.user.customer_profile_id)
        // available_credit arrives as a string (Decimal as_string); coerce so
        // toLocaleString actually formats it instead of echoing it back.
        .then((data) => setActualAvailableCredit(Number(data.available_credit) || 0))
        .catch(() => {});
    }

    // Load the real credit tier shown beside available credit
    getMyProfile()
      .then((profile) => setProfileTier(profile.credit_tier))
      .catch(() => {});
  }, []);

  // Still pull the populated-user stats from mock (for the "existing user" view)
  const {
    hasActiveLoan, inArrears,
    onTimeRate, completedCycles, reliability,
  } = borrowerProfile;

  // Untiered customers are treated as Tier C by the credit calculation
  // (TIER_MULTIPLIERS defaults to C), so display it the same way.
  const tier = profileTier || "C";
  const tierLabel = TIER_LABELS[tier] || TIER_LABELS.C;

  // Real earned SokoPoints, carried on the same check-in response as the gate progress.
  const sokoPoints = checkinData.soko_points_total ?? 0;

  // ── Derived state ──────────────────────────────────────────────────
  const savingsDays = checkinData.count;
  const savingsGoalDays = checkinData.goal;
  const gateComplete = checkinData.gate_complete;

  // A rejected request is not an open loan — it shouldn't mark the journey
  // step done or block a fresh application.
  const realLoans = loans.filter((l) => l.status !== "rejected");
  const hasAnyLoan = realLoans.length > 0;
  const hasRepaidLoan = realLoans.some((l) => l.status === "fully_paid");

  // One open loan at a time: cannot apply again until the current one is settled.
  const OPEN_LOAN_STATUSES = ["pending", "active", "restructured"];
  const hasOpenLoan = loans.some((l) => OPEN_LOAN_STATUSES.includes(l.status));

  // Most recent request, whatever its outcome — drives the rejection notice.
  const latestLoan = loans[0] || null;
  const latestRejected =
    latestLoan &&
    (latestLoan.status === "rejected" || latestLoan.approval_decision === "rejected");

  // A user is "new" if they haven't completed the savings gate yet
  const isNewUser = !gateComplete;
  const isFirstTimer = savingsDays < savingsGoalDays;
  const applyDisabled = inArrears || hasOpenLoan || (isNewUser && isFirstTimer);

  const disabledReason = inArrears
    ? "You have an outstanding arrears balance"
    : hasOpenLoan
    ? "Repay your current loan in full before applying for another"
    : (isNewUser && isFirstTimer)
    ? `Savings gate not yet complete — ${savingsGoalDays - savingsDays} days remaining`
    : null;

  // ── Savings STK handler ───────────────────────────────────────────
  const [stkMessage, setStkMessage] = useState("");
  const [savingsCrid, setSavingsCrid] = useState(null);

  const refreshAfterSaving = async () => {
    setCheckinData(await getCheckins());
    if (session?.user?.customer_profile_id) {
      const creditData = await getAvailableCredit(session.user.customer_profile_id);
      setActualAvailableCredit(Number(creditData.available_credit) || 0);
    }
  };

  // Poll the pending SavingsDeposit until Safaricom's callback resolves it.
  const pollSavingsDeposit = async (crid) => {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      let d;
      try { d = await getSavingsDepositStatus(crid); } catch { continue; }
      if (d.status === "completed") {
        await refreshAfterSaving();
        setStkMessage("KES 200 received — savings and available credit updated.");
        setTimeout(() => { setStkMessage(""); setSavingsCrid(null); }, 4000);
        setCheckinLoading(false);
        return;
      }
      if (d.status === "failed") {
        setCheckinError(d.failure_reason || "M-Pesa deposit failed.");
        setStkMessage("");
        setSavingsCrid(null);
        setCheckinLoading(false);
        return;
      }
    }
    setCheckinError("Timed out waiting for M-Pesa confirmation.");
    setStkMessage("");
    setCheckinLoading(false);
  };

  const handleCheckin = async () => {
    if (checkinLoading) return;
    setCheckinLoading(true);
    setCheckinError("");
    try {
      const { checkout_request_id } = await initiateSavingsStk();
      setSavingsCrid(checkout_request_id);
      setStkMessage(`M-Pesa STK push sent to ${session?.user?.phone_number || "your phone"}. Waiting for confirmation…`);
      pollSavingsDeposit(checkout_request_id);
    } catch (err) {
      setCheckinError(err.message || "Could not start the deposit.");
      setStkMessage("");
      setCheckinLoading(false);
    }
  };

  const handleSimulateSavings = async () => {
    if (!savingsCrid) return;
    try { await simulateMpesaCallback(savingsCrid); }
    catch (err) { setCheckinError(err.message); }
  };

  return (
    <div className="pb-24 md:pb-12 md:max-w-6xl md:mx-auto md:px-8 md:pt-8 min-h-screen">
      
      {/* Desktop Header / Toolbar */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">My Hub</h1>
          <p className="text-sm text-ink-muted">Welcome back, {firstName}</p>
        </div>
        {!isNewUser && (
          <button
            onClick={applyDisabled ? undefined : () => navigate("/customer/loan")}
            disabled={applyDisabled}
            className={`px-6 py-2.5 rounded font-semibold text-sm transition-all shadow-sm ${
              applyDisabled
                ? "bg-ground-dim text-ink-muted cursor-not-allowed border border-border"
                : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
            }`}
          >
            Apply for Loan
          </button>
        )}
      </div>

      {latestRejected && (
        <div className="mx-5 md:mx-0 mb-4 md:mb-6 rounded-md md:rounded-xl border border-status-missed-border bg-status-missed-bg p-4 md:p-5 shadow-sm">
          <p className="text-sm font-bold text-status-missed-text mb-1">
            Loan request not approved
          </p>
          <p className="text-xs md:text-sm text-status-missed-text/90 leading-relaxed">
            Your request for KES {Number(latestLoan.principal).toLocaleString()} was reviewed
            and not approved{latestLoan.approval_notes ? `: "${latestLoan.approval_notes}"` : "."}
          </p>
          <p className="text-xs md:text-sm text-ink-dim leading-relaxed mt-2">
            You can keep saving with SokoCredit to grow your credit tier and raise your limit,
            or speak to a loan officer for a manual review.
          </p>
          <button
            onClick={() => navigate("/customer/loan")}
            className="mt-3 text-xs font-semibold text-primary border border-status-paid-border bg-status-paid-bg px-3 py-1.5 rounded hover:opacity-80 transition-opacity">
            Apply again
          </button>
        </div>
      )}

      {isNewUser ? (
        // ==========================================
        // NEW USER EMPTY STATE (Screenshots 1 & 2)
        // ==========================================
        <div className="flex flex-col gap-0 md:gap-6">
          
          {/* Top Hero Card & Banner */}
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div className="bg-ink px-5 pt-6 pb-8 mx-5 mt-5 md:mx-0 md:mt-0 rounded-md md:rounded-xl shadow-sm flex flex-col justify-center">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-white/10 border border-white/20 px-2 py-1 rounded">
                  <p className="text-[10px] font-mono font-medium text-white/80 uppercase tracking-widest">
                    Tier Pending · Evaluation in progress
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">SokoPoints</p>
                  <p className="text-xl font-bold font-mono text-white/40">0 pts</p>
                </div>
              </div>
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">Available Credit</p>
              <div className="flex items-end gap-2 mb-4">
                <p className="text-4xl font-bold font-mono text-white/40 tracking-tight">KES {actualAvailableCredit.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded text-center">
                <p className="text-[11px] font-mono text-white/60">
                  Complete the 14-day savings gate to unlock your credit limit
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 mx-5 mt-4 md:mx-0 md:mt-0">
              <div className="bg-status-paid-bg border border-status-paid-border rounded-md md:rounded-xl p-4 md:p-6 shadow-sm">
                <p className="text-sm font-bold text-status-paid-text mb-1">Welcome, {firstName}!</p>
                <p className="text-xs text-status-paid-text/80 leading-relaxed">
                  Your account is set up. Complete the savings gate below to qualify for your first loan.
                </p>
              </div>
            </div>
          </div>

          <div className="md:grid md:grid-cols-[1fr_300px] md:gap-6 mt-4 md:mt-0">
            {/* Main Content: Journey & Savings Gate */}
            <div className="flex flex-col gap-4 mx-5 md:mx-0">
              
              {/* 14-Day Savings Gate Tracker */}
              <div className="bg-surface border border-status-paid-text/50 rounded-md md:rounded-xl p-4 md:p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-ink uppercase tracking-wide">14-Day Savings Gate</h3>
                    <p className="text-[11px] text-ink-muted mt-0.5">Complete this to unlock loan eligibility</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-primary">{savingsDays}</span>
                    <span className="text-xs font-mono text-ink-muted">/{savingsGoalDays}</span>
                  </div>
                </div>
                
                <div className="flex gap-1.5 mb-4 overflow-hidden">
                  {Array.from({ length: savingsGoalDays }).map((_, i) => (
                    <div key={i} className={`flex-1 h-3 rounded-sm transition-colors ${
                      i < savingsDays ? "bg-primary" : "bg-border opacity-50"
                    }`} />
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[11px] font-mono text-ink-dim">
                    {gateComplete ? "Savings gate complete!" : `Day ${savingsDays} of ${savingsGoalDays} — check in daily`}
                  </p>
                  <button className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded">How it works</button>
                </div>
                
                {checkinError && (
                  <p className="text-[11px] text-status-missed-text mb-2 font-medium">{checkinError}</p>
                )}
                
                {stkMessage && (
                  <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded text-xs text-primary font-medium">
                    {stkMessage}
                    {import.meta.env.DEV && savingsCrid && (
                      <button onClick={handleSimulateSavings} className="ml-2 underline font-semibold">
                        Simulate confirmation (dev)
                      </button>
                    )}
                  </div>
                )}
                
                <button
                  onClick={handleCheckin}
                  disabled={checkinLoading || gateComplete}
                  className={`w-full py-3.5 rounded font-semibold text-sm transition-colors shadow-sm ${
                    gateComplete
                      ? "bg-ground-dim text-ink-muted cursor-not-allowed border border-border"
                      : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
                  }`}
                >
                  {gateComplete
                    ? "✓ Savings Gate Complete"
                    : checkinLoading
                    ? "Waiting for M-Pesa..."
                    : `Save KES 200 (M-Pesa)`
                  }
                </button>
              </div>

              {/* Your SokoCredit Journey */}
              <div className="bg-surface border border-border rounded-md md:rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-border bg-ground">
                  <h3 className="text-[11px] font-bold text-ink-dim uppercase tracking-wider">Your SokoCredit Journey</h3>
                </div>
                
                <div className="flex flex-col">
                  {/* Step 1: Always Done (user is logged in) */}
                  <div className="flex items-start gap-4 p-4 border-b border-border">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">Account Created</p>
                      <p className="text-[11px] text-ink-muted mt-0.5">Identity & business verified</p>
                    </div>
                  </div>
                  
                  {/* Step 2: Savings Gate — Done or In Progress */}
                  <div className={`flex items-start gap-4 p-4 border-b border-border ${!gateComplete ? 'bg-status-paid-bg/30' : ''}`}>
                    {gateComplete ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-ink">14-Day Savings Gate</p>
                          <p className={`text-[11px] mt-0.5 ${gateComplete ? 'text-status-paid-text' : 'text-primary'}`}>
                            {gateComplete ? 'Completed — you are eligible!' : `Check in daily — ${savingsGoalDays - savingsDays} days remaining`}
                          </p>
                        </div>
                        {!gateComplete && (
                          <span className="text-[9px] font-mono font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 3: Apply for Loan — locked until gate done, done if has loan */}
                  <div className={`flex items-start gap-4 p-4 border-b border-border ${!gateComplete ? 'opacity-50' : ''}`}>
                    {hasAnyLoan ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                        gateComplete ? 'bg-primary text-white' : 'bg-border text-ink-muted'
                      }`}>3</div>
                    )}
                    <div>
                      <p className={`text-sm font-bold ${gateComplete ? 'text-ink' : 'text-ink-muted'}`}>Apply for Your First Loan</p>
                      <p className="text-[11px] text-ink-muted mt-0.5">
                        {hasAnyLoan ? 'Loan applied successfully' : gateComplete ? 'You are now eligible to apply!' : 'Unlock after savings gate clears'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 4: Repay — locked until has loan, done if repaid */}
                  <div className={`flex items-start gap-4 p-4 ${!hasAnyLoan ? 'opacity-50' : ''}`}>
                    {hasRepaidLoan ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                        hasAnyLoan ? 'bg-primary text-white' : 'bg-border text-ink-muted'
                      }`}>4</div>
                    )}
                    <div>
                      <p className={`text-sm font-bold ${hasAnyLoan ? 'text-ink' : 'text-ink-muted'}`}>Repay On Time → Grow Your Tier</p>
                      <p className="text-[11px] text-ink-muted mt-0.5">
                        {hasRepaidLoan ? 'Excellent! Tier upgrade unlocked' : 'Build credit history, increase limit'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Desktop Quick Actions & Apply */}
            <div className="flex flex-col gap-6 mx-5 mt-6 md:mx-0 md:mt-0">
              
              <div className="hidden md:flex flex-col gap-2">
                <button
                  onClick={applyDisabled ? undefined : () => navigate("/customer/loan")}
                  disabled={applyDisabled}
                  className={`w-full py-4 rounded font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    applyDisabled
                      ? "bg-[#E6DFD3] text-ink-muted cursor-not-allowed border border-border"
                      : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
                  }`}
                >
                  Apply for Loan
                </button>
                {disabledReason && (
                  <p className="text-[11px] text-[#C2410C] text-center font-bold">
                    {disabledReason}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-3">Quick Actions</p>
                <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:gap-2.5">
                  {[
                    { label: "Statements", icon: "📄", to: "/customer/profile" },
                    { label: "History", icon: "📋", to: "/customer/portfolio" },
                    { label: "Support", icon: "💬", to: null },
                  ].map(({ label, icon, to }) => (
                    <button
                      key={label}
                      onClick={to ? () => navigate(to) : undefined}
                      className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-3 py-3 md:py-3.5 md:px-4 rounded border border-border bg-surface text-[11px] md:text-sm font-medium text-ink-dim hover:bg-ground transition-colors shadow-sm"
                    >
                      <span className="text-xl md:text-lg">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Sticky Bottom CTA for New User */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-ground border-t border-border z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
              onClick={applyDisabled ? undefined : () => navigate("/customer/loan")}
              disabled={applyDisabled}
              className={`w-full py-4 rounded font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                applyDisabled
                  ? "bg-[#E6DFD3] text-ink-muted cursor-not-allowed border border-border"
                  : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
              }`}
            >
              Apply for Loan
            </button>
            {disabledReason && (
              <p className="text-[11px] text-[#C2410C] mt-2 text-center font-bold">
                {disabledReason}
              </p>
            )}
          </div>

        </div>
      ) : (
        // ==========================================
        // POPULATED USER STATE (Existing Design)
        // ==========================================
        <div className="flex flex-col gap-0 md:gap-6">
          <div className="md:grid md:grid-cols-4 md:gap-6">
            <div className="bg-ink px-5 pt-6 pb-8 mx-5 mt-5 md:mx-0 md:mt-0 rounded-md md:rounded-xl shadow-sm md:col-span-2 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-6">
                <div className={`${TIER_STYLES[tier] || TIER_STYLES.C} px-2 py-1 rounded`}>
                  <p className="text-[10px] font-mono font-medium text-white uppercase tracking-widest">
                    Tier {tier} · {tierLabel}
                  </p>
                </div>
                <div className="md:hidden">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">SokoPoints</p>
                  <p className="text-xl font-bold font-mono text-accent">{sokoPoints}</p>
                </div>
              </div>
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">Available Credit</p>
              <div className="flex items-end gap-2 mb-4">
                <p className="text-4xl font-bold font-mono text-white tracking-tight">KES {actualAvailableCredit.toLocaleString()}</p>
              </div>
              <button
                onClick={handleCheckin}
                disabled={checkinLoading}
                className="w-full md:w-auto px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-hover active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                {checkinLoading ? "Processing..." : "Save KES 200 (M-Pesa)"}
              </button>
            </div>

            <div className="hidden md:flex flex-col justify-center p-6 rounded-xl shadow-sm bg-ink">
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1">SokoPoints</p>
              <p className="text-4xl font-bold font-mono text-accent mb-3">{sokoPoints.toLocaleString()}</p>
              <p className="text-xs text-white/60">Redeem points for lower interest rates or loan extensions.</p>
            </div>

            <div className="hidden md:flex flex-col justify-center p-6 rounded-xl shadow-sm bg-surface border border-border">
               <p className="text-xs font-semibold text-ink-dim uppercase tracking-wide mb-2">Savings Gate</p>
               <p className="text-sm font-semibold text-status-paid-text flex items-center gap-2">
                 <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                 </svg>
                 Completed & Unlocked
               </p>
            </div>
          </div>

          <div className="md:grid md:grid-cols-[2fr_1fr] md:gap-6 md:items-start mt-4 md:mt-0">
            <div className="mx-5 md:mx-0 p-4 md:p-6 rounded-md md:rounded-xl shadow-sm bg-surface border border-border">
              <p className="text-xs md:text-sm font-semibold text-ink-dim uppercase tracking-wide mb-4">Repayment Discipline</p>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 text-center p-3 md:p-4 rounded bg-ground border border-border-dim">
                  <p className="text-xl md:text-2xl font-bold font-mono text-status-paid-text">{onTimeRate}%</p>
                  <p className="text-[10px] md:text-xs text-ink-muted mt-0.5">On-time rate</p>
                </div>
                <div className="flex-1 text-center p-3 md:p-4 rounded bg-ground border border-border-dim">
                  <p className="text-xl md:text-2xl font-bold font-mono text-ink">{completedCycles}</p>
                  <p className="text-[10px] md:text-xs text-ink-muted mt-0.5">Completed cycles</p>
                </div>
                <div className="flex-1 text-center p-3 md:p-4 rounded bg-ground border border-border-dim">
                  <p className="text-xl md:text-2xl font-bold font-mono text-ink">{reliability}</p>
                  <p className="text-[10px] md:text-xs text-ink-muted mt-0.5">Reliability</p>
                </div>
              </div>

              <div className="h-32 md:h-48 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repaymentDiscipline} barSize={24} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#78736A" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: "#78736A" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ background: "#1A1912", border: "none", borderRadius: 6, fontSize: 12 }}
                      labelStyle={{ color: "#9E9A94" }}
                      itemStyle={{ color: "white" }}
                      formatter={(v) => [`${v}%`, "On-time"]}
                      cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                      {repaymentDiscipline.map((entry, i) => (
                        <Cell key={i} fill={entry.rate >= 95 ? "#1B5E38" : entry.rate >= 88 ? "#B45309" : "#C2410C"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mx-5 mt-5 md:mx-0 md:mt-0 mb-5 md:mb-0 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-3">Quick Actions</p>
                <div className="grid grid-cols-3 md:grid-cols-1 gap-2.5">
                  {[
                    { label: "Statements", icon: "📄", to: "/customer/profile" },
                    { label: "History", icon: "📋", to: "/customer/portfolio" },
                    { label: "Support", icon: "💬", to: null },
                  ].map(({ label, icon, to }) => (
                    <button
                      key={label}
                      onClick={to ? () => navigate(to) : undefined}
                      className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 py-3.5 md:py-4 md:px-5 rounded-lg border border-border bg-surface text-[11px] md:text-sm font-medium text-ink-dim hover:bg-ground hover:border-primary/30 transition-all shadow-sm"
                    >
                      <span className="text-xl md:text-2xl">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-ground border-t border-border z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
              onClick={applyDisabled ? undefined : () => navigate("/customer/loan")}
              disabled={applyDisabled}
              className={`w-full py-4 rounded font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                applyDisabled
                  ? "bg-ground-dim text-ink-muted cursor-not-allowed border border-border"
                  : "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]"
              }`}
            >
              Apply for Loan
              {!applyDisabled && (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {applyDisabled && disabledReason && (
              <p className="text-[11px] text-status-missed-text mt-2 text-center font-medium">{disabledReason}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
