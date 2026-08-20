
import { portfolioKpis, parAgingBreakdown, marketClusters } from "../../data/mockLenderData";

const KPIS = [
  ["Gross Loan Portfolio", portfolioKpis.grossLoanPortfolio],
  ["PAR > 30 Days", portfolioKpis.parOver30],
  ["NPL > 90 Days", portfolioKpis.nplOver90],
  ["MTD Collection Efficiency", portfolioKpis.mtdCollectionEfficiency],
  ["Net Interest Margin", portfolioKpis.netInterestMargin],
];
const BAR = { green: "bg-status-paid-border", orange: "bg-status-missed-border", red: "bg-status-overdue-border" };
const TREND = { up: "text-status-overdue-text text-xs", down: "text-status-paid-text text-xs" };
const RISK = {
  High: "bg-status-missed-bg text-status-missed-text border-status-missed-border",
  Medium: "bg-status-due-bg text-status-due-text border-status-due-border",
  Low: "bg-status-paid-bg text-status-paid-text border-status-paid-border",
};
const KpiCard = ({ label, data }) => (
  <div className="bg-surface border border-border rounded-lg p-5">
    <p className="text-xs uppercase text-ink-muted tracking-wide mb-2">{label}</p>
    <p className="text-2xl font-bold text-ink mb-1">{data.value}</p>
    <p className={TREND[data.trend] || "text-ink-muted text-xs"}>{data.change}</p>
  </div>
);
const RiskBadge = ({ level }) => (
  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${RISK[level]}`}>{level}</span>
);
export default function CommandCenter() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Command Center</h1>
      <p className="text-ink-dim mb-8">Thursday, 20 August 2026</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {KPIS.map(([label, data]) => <KpiCard key={label} label={label} data={data} />)}
      </div>
      <div className="bg-surface border border-border rounded-lg p-5 mb-8">
        <h2 className="text-lg font-semibold text-ink mb-4">PAR Aging Breakdown</h2>
        <div className="flex h-4 rounded-full overflow-hidden mb-4">
          {parAgingBreakdown.map((seg) => (
            <div key={seg.label} style={{ width: `${seg.value}%` }} className={BAR[seg.color] || "bg-status-overdue-text"} />
          ))}
 </div>
        <div className="flex flex-wrap gap-4 text-sm text-ink-dim">
          {parAgingBreakdown.map((seg) => (
            <span key={seg.label}>{seg.label}: <strong className="text-ink">{seg.value}%</strong></span>
          ))}
        </div>
 </div>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h2 className="text-lg font-semibold text-ink">Market Cluster Risk</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-ground text-ink-muted text-xs uppercase tracking-wide">
            <tr>{["Market", "Loans", "PAR Rate", "Risk", "Status"].map((h) => <th key={h} className="text-left px-5 py-3">{h}</th>)}</tr>
          </thead>

