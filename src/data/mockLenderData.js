// Institution & staff
export const institution = {
  name: "SokoCredit",
  staffName: "Sarah Kamau",
  staffRole: "Super Admin",
};

// Command Center — top KPI cards
export const portfolioKpis = {
  grossLoanPortfolio: { value: "KES 4.2M", change: "+8.3% MoM", trend: "up" },
  parOver30: { value: "12.4%", change: "+1.2pp", trend: "up" },
  nplOver90: { value: "4.1%", change: "-0.3pp", trend: "down" },
  mtdCollectionEfficiency: { value: "86.7%", change: "+2.1pp", trend: "up" },
  netInterestMargin: { value: "18.2%", change: "Stable", trend: "flat" },
};

// PAR Aging donut breakdown
export const parAgingBreakdown = [
  { label: "Current", value: 70, color: "green" },
  { label: "1-30 days", value: 18, color: "orange" },
  { label: "31-90 days", value: 8, color: "red" },
  { label: "90+ days", value: 4, color: "maroon" },
];

// Collection efficiency — 8 week trend
export const collectionEfficiencyTrend = [
  { week: "W1", value: 79 },
  { week: "W2", value: 87 },
  { week: "W3", value: 78 },
  { week: "W4", value: 88 },
  { week: "W5", value: 84 },
  { week: "W6", value: 91 },
  { week: "W7", value: 87 },
  { week: "W8", value: 87 },
];

// Market cluster risk table
export const marketClusters = [
  { market: "Muthurwa Market", loans: 98, parRate: "18.7%", risk: "High", disruption: true },
  { market: "Gikomba Market", loans: 211, parRate: "7.4%", risk: "Low", disruption: false },
  { market: "Wakulima Market", loans: 64, parRate: "22.1%", risk: "High", disruption: true },
  { market: "Kangemi Market", loans: 87, parRate: "11.3%", risk: "Medium", disruption: false },
  { market: "Ngara Market", loans: 45, parRate: "5.8%", risk: "Low", disruption: false },
];

// Borrowers — shared across Operations, Approval Desk, CRM
export const borrowers = [
  {
    id: "B-001",
    fullName: "Aisha Omar Farah",
    displayName: "Aisha Omar",
    initials: "AO",
    market: "Toi Market",
    stall: "A-24",
    phone: "0712 345 678",
    tier: "B",
    status: "missed", // paid | due | missed | overdue
    balance: 4375,
    inHouseScore: 74,
    nationalId: "12 345 678",
    gender: "Female",
    dob: "14 Jun 1988",
    monthlyTurnover: "KES 30,000 - 60,000",
    nextOfKin: "Grace Wanjiku · 0711 333 444",
    address: "Toi Market, Ngong Road, Nairobi",
    email: "",
  },
  {
    id: "B-002",
    fullName: "Fatuma Hassan",
    displayName: "Fatuma Hassan",
    initials: "FH",
    market: "Muthurwa",
    stall: "B-12",
    phone: "0722 111 222",
    tier: "B",
    status: "paid",
    balance: 0,
    inHouseScore: 74,
    missedAmount: 1750,
    daysLate: 7,
  },
  {
    id: "B-003",
    fullName: "Grace Wanjiku",
    displayName: "Grace Wanjiku",
    initials: "GW",
    market: "Gikomba",
    stall: "G-12",
    phone: "0733 222 333",
    tier: "A",
    status: "paid",
    balance: 0,
  },
  {
    id: "B-004",
    fullName: "Rose Atieno",
    displayName: "Rose Atieno",
    initials: "RA",
    market: "Gikomba",
    stall: "G-45",
    phone: "0733 222 333",
    tier: "C",
    status: "overdue",
    balance: 3500,
    missedAmount: 875,
    daysLate: 3,
  },
  {
    id: "B-005",
    fullName: "Wanjiku Mwangi",
    displayName: "Wanjiku",
    initials: "W",
    market: "Toi",
    stall: "A-...",
    phone: "0712 333 ...",
    tier: "B",
    status: "missed",
    missedAmount: 875,
    daysLate: 1,
  },
];

// Operations — daily targets
export const dailyTargets = {
  expectedToday: 28350,
  collectedToday: 19475,
  remaining: 8875,
};

// Operations — live collections feed
export const liveCollections = [
  { time: "08:42", name: "Aisha Omar", amount: 875, channel: "M-Pesa", reference: "PGH3K2M7X9" },
  { time: "09:15", name: "Grace Wanjiku", amount: 1750, channel: "M-Pesa", reference: "QRT5L8N2Y1" },
  { time: "09:48", name: "Lucy Ndege", amount: 500, channel: "Cash", reference: "CASH-2026-0819-001" },
  { time: "10:22", name: "Jane Mutua", amount: 875, channel: "M-Pesa", reference: "MPX9K3L2P8" },
];

// Approval Desk — new loan applications
export const newApplications = [
  {
    id: "APP-2026-0891",
    borrowerName: "Fatuma Hassan",
    market: "Muthurwa",
    stall: "B-12",
    status: "pending",
    tier: "B",
    inHouseScore: 74,
    savingsTrack: "Good - 6 consecutive cycles",
    stallVerified: true,
    principal: 10000,
    term: "30 days",
    frequency: "Weekly",
    installment: 2768,
  },
  {
    id: "APP-2026-0892",
    borrowerName: "Peter Omondi",
    market: "Gikomba",
    stall: "G-45",
    status: "pending",
    tier: "B",
    inHouseScore: 68,
    savingsTrack: "Good - 4 consecutive cycles",
    stallVerified: true,
    principal: 8000,
    term: "30 days",
    frequency: "Weekly",
    installment: 2214,
  },
];

// Approval Desk — reschedule/extension requests
export const rescheduleRequests = [
  {
    id: "RSC-2026-0044",
    borrowerName: "Rose Atieno",
    market: "Gikomba",
    stall: "G-45",
    reasonCategory: "Business disruption",
    requestedMode: "extend_tenure",
    requestedExtensionDays: 14,
  },
];