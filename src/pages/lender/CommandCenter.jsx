
import { portfolioKpis, parAgingBreakdown, marketClusters } from "../../data/mockLenderData";

const KPIS = [
  ["Gross Loan Portfolio", portfolioKpis.grossLoanPortfolio],
  ["PAR > 30 Days", portfolioKpis.parOver30],
  ["NPL > 90 Days", portfolioKpis.nplOver90],
  ["MTD Collection Efficiency", portfolioKpis.mtdCollectionEfficiency],
  ["Net Interest Margin", portfolioKpis.netInterestMargin],
];
