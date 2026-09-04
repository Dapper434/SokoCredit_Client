import { useEffect, useState } from "react";
import { portfolioKpis, parAgingBreakdown as basePar, collectionEfficiencyTrend as baseTrend, marketClusters, borrowers } from "../../data/mockLenderData";
import { getStaffMembers, getSession } from "../../lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const KPIS_BASE = [
  ["Gross Loan Portfolio", portfolioKpis.grossLoanPortfolio],
  ["PAR > 30 Days", portfolioKpis.parOver30],
  ["NPL > 90 Days", portfolioKpis.nplOver90],
  ["MTD Collection Efficiency", portfolioKpis.mtdCollectionEfficiency],
  ["Net Interest Margin", portfolioKpis.netInterestMargin],
];
const TREND = { up: "text-status-overdue-text text-xs", down: "text-status-paid-text text-xs" };
const RISK = {
  High: "bg-status-missed-bg text-status-missed-text border-status-missed-border",
  Medium: "bg-status-due-bg text-status-due-text border-status-due-border",
  Low: "bg-status-paid-bg text-status-paid-text border-status-paid-border",
};

export default function CommandCenter() {
  // Toggle this to see the populated mock data state
  const hasData = true;
  
  const [hasLoanOfficer, setHasLoanOfficer] = useState(false);
  const [dynamicKpis, setDynamicKpis] = useState(KPIS_BASE);
  
  // Initialize with correct Recharts shape to prevent crashes before useEffect
  const initialPar = [{
    name: "Portfolio",
    "Current": basePar[0].value,
    "1-30 days": basePar[1].value,
    "31-90 days": basePar[2].value,
    "90+ days": basePar[3].value
  }];
  const initialTrend = baseTrend.map(t => ({ week: t.week, Efficiency: t.value }));
  
  const [dynamicPar, setDynamicPar] = useState(initialPar);
  const [dynamicTrend, setDynamicTrend] = useState(initialTrend);
  const hasBorrower = borrowers.length > 0;

  useEffect(() => {
    const session = getSession();
    const instId = session?.user?.lending_institution_id || 1;
    const multiplier = 1 + (instId * 0.15); // Scale values slightly per institution
    
    setDynamicKpis([
      ["Gross Loan Portfolio", { ...portfolioKpis.grossLoanPortfolio, value: `KES ${(4.2 * multiplier).toFixed(1)}M` }],
      ["PAR > 30 Days", { ...portfolioKpis.parOver30, value: `${(12.4 * (1 - instId * 0.05)).toFixed(1)}%` }],
      ["NPL > 90 Days", { ...portfolioKpis.nplOver90, value: `${(4.1 * (1 - instId * 0.05)).toFixed(1)}%` }],
      ["MTD Collection Efficiency", { ...portfolioKpis.mtdCollectionEfficiency, value: `${Math.min(99, 86.7 + instId * 2).toFixed(1)}%` }],
      ["Net Interest Margin", { ...portfolioKpis.netInterestMargin, value: `${(18.2 + instId * 0.5).toFixed(1)}%` }],
    ]);

    setDynamicPar([
      { name: "Portfolio", 
        "Current": Math.max(50, basePar[0].value - instId * 2), 
        "1-30 days": basePar[1].value + instId, 
        "31-90 days": basePar[2].value + instId * 0.5, 
        "90+ days": basePar[3].value + instId * 0.5 
      }
    ]);

    setDynamicTrend(baseTrend.map((t, idx) => ({
      week: t.week,
      Efficiency: Math.min(100, Math.max(60, t.value + (instId * 2) - idx))
    })));

    getStaffMembers()
      .then(staff => {
        setHasLoanOfficer(staff.some(s => s.role === "loan_officer"));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Command Center</h1>
      <p className="text-ink-dim mb-8">
        Monday, 31 August 2026
      </p>

      {/* Onboarding Progress Top Bar (New Institution Empty State) */}
      {!hasData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-status-paid-text text-white p-4 rounded-md border border-status-paid-text flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            <span className="text-sm font-semibold">Institution profile</span>
          </div>
          <div className="bg-status-paid-text text-white p-4 rounded-md border border-status-paid-text flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            <span className="text-sm font-semibold">Settlement account</span>
          </div>
          {hasLoanOfficer ? (
            <div className="bg-status-paid-text text-white p-4 rounded-md border border-status-paid-text flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
              <span className="text-sm font-semibold">Add first loan officer</span>
            </div>
          ) : (
            <div className="bg-surface border border-border p-4 rounded-md flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-border-dim"></div>
              <span className="text-sm font-semibold text-ink-muted">Add first loan officer</span>
            </div>
          )}
          
          {hasBorrower ? (
            <div className="bg-status-paid-text text-white p-4 rounded-md border border-status-paid-text flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
              <span className="text-sm font-semibold">Onboard first borrower</span>
            </div>
          ) : (
            <div className="bg-surface border border-border p-4 rounded-md flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-border-dim"></div>
              <span className="text-sm font-semibold text-ink-muted">Onboard first borrower</span>
            </div>
          )}
        </div>
      )}

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {dynamicKpis.map(([label, data]) => <KpiCard key={label} label={label} data={data} hasData={hasData} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* PAR Aging Breakdown */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-xs uppercase text-ink-muted tracking-wide font-bold mb-4">PAR AGING BREAKDOWN</h2>
          {hasData ? (
            <div className="flex flex-col gap-4">
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={dynamicPar}
                    margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="Current" stackId="a" fill="#10B981" radius={[4, 0, 0, 4]} />
                    <Bar dataKey="1-30 days" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="31-90 days" stackId="a" fill="#EF4444" />
                    <Bar dataKey="90+ days" stackId="a" fill="#7F1D1D" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#10B981]"></span>
                  <span className="text-sm font-medium text-ink">Current ({dynamicPar[0]["Current"].toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#F59E0B]"></span>
                  <span className="text-sm font-medium text-ink">1-30 days ({dynamicPar[0]["1-30 days"].toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#EF4444]"></span>
                  <span className="text-sm font-medium text-ink">31-90 days ({dynamicPar[0]["31-90 days"].toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#7F1D1D]"></span>
                  <span className="text-sm font-medium text-ink">90+ days ({dynamicPar[0]["90+ days"].toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 border-2 border-dashed border-border-dim rounded flex flex-col items-center justify-center text-center px-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-ink-muted mb-2 opacity-50">
                <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
              </svg>
              <p className="text-xs text-ink-muted">Portfolio aging will appear here once loans are disbursed</p>
            </div>
          )}
        </div>

        {/* Collection Efficiency */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-xs uppercase text-ink-muted tracking-wide font-bold mb-4">COLLECTION EFFICIENCY — 8 WEEKS</h2>
          {hasData ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="week" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="Efficiency" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 border-2 border-dashed border-border-dim rounded flex flex-col items-center justify-center text-center px-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-ink-muted mb-2 opacity-50">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              <p className="text-xs text-ink-muted">Collection trend will populate once borrowers start repaying loans</p>
            </div>
          )}
        </div>
      </div>

      {/* Market cluster risk table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-wide text-ink">Market Cluster Risk Overview</h2>
          {!hasData && <span className="text-xs text-ink-muted">No clusters configured</span>}
        </div>
        
        {hasData ? (
          <table className="w-full text-sm">
            <thead className="bg-ground text-ink-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Market</th>
                <th className="text-left px-5 py-3">Loans</th>
                <th className="text-left px-5 py-3">PAR Rate</th>
                <th className="text-left px-5 py-3">Risk</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {marketClusters.map((m) => (
                <tr key={m.market} className="hover:bg-ground">
                  <td className="px-5 py-3 text-ink font-medium">{m.market}</td>
                  <td className="px-5 py-3 text-ink-dim">{m.loans}</td>
                  <td className="px-5 py-3 text-ink-dim">{m.parRate}</td>
                  <td className="px-5 py-3">
                    <RiskBadge level={m.risk} />
                  </td>
                  <td className="px-5 py-3">
                    {m.disruption ? (
                      <span className="text-status-overdue-text text-xs font-semibold">
                        ⚠ Disruption flag
                      </span>
                    ) : (
                      <span className="text-ink-muted text-xs">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-ground flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-ink-muted opacity-50">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-ink mb-1">No market clusters yet</h3>
            <p className="text-[11px] text-ink-muted max-w-sm mx-auto">
              Market performance data will appear here once loan officers are assigned to markets and borrowers are enrolled.
            </p>
          </div>
        )}
      </div>

      {/* Regulatory & Audit Exports (Added from screenshot) */}
      {!hasData && (
        <div className="mt-8 bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-xs font-bold uppercase tracking-wide text-ink">Regulatory & Audit Exports</h2>
          </div>
          <div className="p-5 flex flex-wrap gap-4">
            <button className="px-4 py-2 border border-status-missed-border text-status-missed-text bg-status-missed-bg/10 rounded flex items-center gap-2 font-medium text-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              Monthly Audit Pack (PDF)
            </button>
            <button className="px-4 py-2 border border-status-paid-border text-status-paid-text bg-status-paid-bg/10 rounded flex items-center gap-2 font-medium text-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              Portfolio Extract (CSV)
            </button>
          </div>
          <div className="px-5 pb-5">
             <p className="text-[10px] text-ink-muted">Internal/regulatory export format — not connected to external credit bureaus.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, data, hasData }) {
  return (
    <div className="bg-surface border border-border-dim border-dashed rounded-lg p-5">
      <p className="text-[10px] uppercase font-bold text-ink-muted tracking-wide mb-2">{label}</p>
      {hasData ? (
        <>
          <p className="text-2xl font-bold text-ink mb-1">{data.value}</p>
          <p
            className={
              data.trend === "up"
                ? "text-status-overdue-text text-xs"
                : data.trend === "down"
                ? "text-status-paid-text text-xs"
                : "text-ink-muted text-xs"
            }
          >
            {data.change}
          </p>
        </>
      ) : (
        <>
          <p className="text-xl font-bold text-ink-muted mb-4">--</p>
          <p className="text-[10px] text-border">No data yet</p>
        </>
      )}
    </div>
  );
}

function RiskBadge({ level }) {
  const styles = {
    High: "bg-status-missed-bg text-status-missed-text border-status-missed-border",
    Medium: "bg-status-due-bg text-status-due-text border-status-due-border",
    Low: "bg-status-paid-bg text-status-paid-text border-status-paid-border",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${styles[level]}`}>
      {level}
    </span>
  );
}