import { useState } from "react";
import { newApplications, rescheduleRequests } from "../../data/mockLenderData";

export default function ApprovalDesk() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Approval Desk</h1>
      <p className="text-ink-dim mb-8">Thursday, 20 August 2026</p>

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
            {newApplications.length}
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
          {newApplications.map((app) => (
            <div key={app.id} className="bg-surface border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-ink-muted mb-1">{app.id}</p>
                  <p className="font-bold text-ink text-lg">
                    {app.borrowerName}{" "}
                    <span className="font-normal text-ink-muted text-sm">
                      {app.market} · {app.stall}
                    </span>
                  </p>
                </div>
                <span className="bg-status-pending-bg text-status-pending-text border border-status-pending-border text-xs font-semibold px-3 py-1 rounded-full">
                  PENDING
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs uppercase text-ink-muted tracking-wide mb-2">
                    Borrower Context
                  </p>
                  <p className="text-ink text-sm mb-1">
                    Tier {app.tier} · In-house score: {app.inHouseScore}/100
                  </p>
                  <p className="text-ink-dim text-sm mb-1">Savings track: {app.savingsTrack}</p>
                  <p className="text-sm">
                    Stall verified:{" "}
                    <span className={app.stallVerified ? "text-status-paid-text" : "text-ink-muted"}>
                      {app.stallVerified ? "Verified" : "Not verified"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-ink-muted tracking-wide mb-2">
                    Facility Request
                  </p>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-dim">Principal</span>
                    <span className="text-ink font-semibold">
                      KES {app.principal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-dim">Term</span>
                    <span className="text-ink font-semibold">{app.term}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-dim">Repayment</span>
                    <span className="text-ink font-semibold">{app.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-dim">Installment</span>
                    <span className="text-ink font-semibold">
                      KES {app.installment.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-md">
                  Approve
                </button>
                <button className="flex-1 bg-status-missed-bg hover:opacity-80 text-status-missed-text border border-status-missed-border text-sm font-semibold py-2.5 rounded-md">
                  Counter-Offer
                </button>
                <button className="flex-1 bg-status-overdue-bg hover:opacity-80 text-status-overdue-text border border-status-overdue-border text-sm font-semibold py-2.5 rounded-md">
                  Reject
                </button>
              </div>
            </div>
          ))}
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