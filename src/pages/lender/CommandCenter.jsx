
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

