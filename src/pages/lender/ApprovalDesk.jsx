import { useState, useEffect } from "react";
import { getPendingApplications, approveLoan, rejectLoan, disburseLoan } from "../../lib/api";
import { rescheduleRequests } from "../../data/mockLenderData";

export default function ApprovalDesk() {
  const [activeTab, setActiveTab] = useState("new");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getPendingApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (loanId) => {
    try {
      await approveLoan(loanId);
      await disburseLoan(loanId); // Auto disburse for demo
      fetchApplications();
    } catch (err) {
      alert("Error approving loan: " + err.message);
    }
  };

  const handleReject = async (loanId) => {
    try {
      await rejectLoan(loanId);
      fetchApplications();
    } catch (err) {
      alert("Error rejecting loan: " + err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Approval Desk</h1>
      <p className="text-ink-dim mb-8">Thursday, 20 August 2026</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded text-sm border border-red-200 mb-6">
          {error}
        </div>
      )}

      <div className="flex gap-6 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("new")}
          className={`pb-3 text-sm font-semibold border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "new"
              ? "border-primary text-primary"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          New Applications
          <span className="bg-primary-light text-primary text-xs px-2 py-0.5 rounded-full">
            {loading ? "..." : applications.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("reschedule")}
          className={`pb-3 text-sm font-semibold border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "reschedule"
              ? "border-primary text-primary"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Reschedule / Extension
          <span className="bg-ground-dim text-ink-dim text-xs px-2 py-0.5 rounded-full">
            {rescheduleRequests.length}
          </span>
        </button>
      </div>

      {activeTab === "new" && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-ink-muted text-sm">Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-border-dim flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-ink-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-ink mb-2">No pending applications</h3>
              <p className="text-[11px] text-ink-muted max-w-sm mx-auto leading-relaxed">
                New loan applications submitted by borrowers through the customer app will appear here for review and decision.
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-surface border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-ink-muted mb-1">Loan #{app.id} · Profile ID {app.customer_profile_id}</p>
                    <p className="font-bold text-ink text-lg">
                      {app.customer_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.exceeds_available_credit && (
                      <span
                        title={`Requested KES ${Number(app.principal).toLocaleString()} against an available limit of KES ${Number(app.available_credit_at_application).toLocaleString()} at the time of application`}
                        className="bg-status-overdue-bg text-status-overdue-text border border-status-overdue-border text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        OVER LIMIT
                      </span>
                    )}
                    <span className="bg-status-pending-bg text-status-pending-text border border-status-pending-border text-xs font-semibold px-3 py-1 rounded-full">
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {app.exceeds_available_credit && (
                  <p className="text-xs text-status-overdue-text bg-status-overdue-bg/40 border border-status-overdue-border rounded px-3 py-2 mb-4">
                    Requested <span className="font-mono font-semibold">KES {Number(app.principal).toLocaleString()}</span>
                    {" "}against an available limit of{" "}
                    <span className="font-mono font-semibold">KES {Number(app.available_credit_at_application).toLocaleString()}</span>
                    {" "}— needs manual approval.
                  </p>
                )}

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs uppercase text-ink-muted tracking-wide mb-2">
                      Borrower Context
                    </p>
                    <p className="text-ink text-sm mb-1">
                      Tier {app.customer_tier} · In-house score: Pending
                    </p>
                    <p className="text-ink-dim text-sm mb-1">Savings track: Active</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-ink-muted tracking-wide mb-2">
                      Facility Request
                    </p>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ink-dim">Principal</span>
                      <span className="text-ink font-semibold">
                        KES {Number(app.principal).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ink-dim">Term</span>
                      <span className="text-ink font-semibold">{app.term_days} days</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ink-dim">Repayment</span>
                      <span className="text-ink font-semibold">{app.repayment_frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleApprove(app.id)}
                    className="flex-1 bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-md"
                  >
                    Approve & Disburse
                  </button>
                  <button 
                    onClick={() => handleReject(app.id)}
                    className="flex-1 bg-status-overdue-bg hover:opacity-80 text-status-overdue-text border border-status-overdue-border text-sm font-semibold py-2.5 rounded-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "reschedule" && (
        <div className="space-y-4">
          {rescheduleRequests.map((req) => (
            <div key={req.id} className="bg-surface border border-border rounded-lg p-6">
              <p className="text-xs text-ink-muted mb-1">{req.id}</p>
              <p className="font-bold text-ink text-lg mb-3">
                {req.borrowerName}{" "}
                <span className="font-normal text-ink-muted text-sm">
                  {req.market} · {req.stall}
                </span>
              </p>
              <p className="text-sm text-ink-dim mb-1">Reason: {req.reasonCategory}</p>
              <p className="text-sm text-ink-dim mb-4">
                Requested: {req.requestedMode.replace("_", " ")} — {req.requestedExtensionDays} days
              </p>
              <div className="flex gap-3">
                <button className="flex-1 bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-md">
                  Approve
                </button>
                <button className="flex-1 bg-status-overdue-bg hover:opacity-80 text-status-overdue-text border border-status-overdue-border text-sm font-semibold py-2.5 rounded-md">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}