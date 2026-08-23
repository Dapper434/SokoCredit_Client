// Signed-in borrower profile — stand-in for a real session/API response
export const borrowerProfile = {
  fullName: "Aisha Omar Farah",
  displayName: "Aisha Omar",
  initials: "AO",
  nationalId: "12 345 678",
  gender: "Female",
  phone: "0712 345 678",
  market: "Toi Market",
  stall: "A-24",
  tier: "B",
  tierLabel: "Good standing",
  availableCredit: 15000,
  sokoPoints: 840,
  hasActiveLoan: true,
  inArrears: false,
  savingsDays: 10,
  savingsGoalDays: 14,
  onTimeRate: 97,
  completedCycles: 4,
  reliability: "High",
  address: "Toi Market, Ngong Road, Nairobi",
  nextOfKinName: "Grace Wanjiku",
  email: "aisha.omar@gmail.com",
};

// My Hub — repayment discipline bar chart (month -> on-time %)
export const repaymentDiscipline = [
  { month: "Mar", rate: 88 },
  { month: "Apr", rate: 92 },
  { month: "May", rate: 95 },
  { month: "Jun", rate: 100 },
  { month: "Jul", rate: 97 },
  { month: "Aug", rate: 100 },
];

// Loan Wizard — constants and options
export const loanWizardConfig = {
  limit: 15000,
  interestRate: 0.15,
  processingFeeRate: 0.03,
  exciseRate: 0.2,
  quickAmounts: [2000, 5000, 8000, 10000, 12000, 15000],
  durations: [7, 14, 30, 60],
  purposes: [
    "Stock/Inventory",
    "Market stall rent",
    "Equipment",
    "Transport",
    "School fees",
    "Medical emergency",
    "Other",
  ],
  disbursementMpesaNumber: "0712 345 678",
};

// Onboarding — market options for the Business & Credit step
export const marketOptions = [
  "Toi Market",
  "Muthurwa Market",
  "Gikomba Market",
  "Wakulima Market",
  "Kangemi Market",
  "Ngara Market",
];

export const turnoverRanges = [
  "Under KES 10,000",
  "KES 10,000 - 30,000",
  "KES 30,000 - 60,000",
  "KES 60,000 - 100,000",
  "Over KES 100,000",
];

// Active Portfolio — repayment schedule
export const repaymentSchedule = [
  { no: 1, date: "22 Jul 2026", expected: 875, paid: 875, channel: "M-Pesa", status: "paid" },
  { no: 2, date: "29 Jul 2026", expected: 875, paid: 875, channel: "M-Pesa", status: "paid" },
  { no: 3, date: "5 Aug 2026", expected: 875, paid: 600, channel: "Cash", status: "partial" },
  { no: 4, date: "12 Aug 2026", expected: 875, paid: 0, channel: "-", status: "missed" },
  { no: 5, date: "19 Aug 2026", expected: 875, paid: 0, channel: "-", status: "due" },
  { no: 6, date: "26 Aug 2026", expected: 875, paid: 0, channel: "-", status: "overdue" },
];

export const portfolioSummary = {
  outstandingBalance: 4375,
  percentRepaid: 37.5,
  nextInstallment: 875,
  dueInDays: 0,
  maturityDate: "4 Sep",
};

// Arrears banner copy, keyed by demo state
export const arrearsBanners = {
  none: null,
  due: {
    label: "Payment Due Today",
    message: "KES 875 is due today. Tap below to pay via M-Pesa.",
  },
  missed: {
    label: "Missed Installment",
    message: "Installment #4 of KES 875 was not received. Interest continues to accrue.",
  },
  overdue: {
    label: "Account in Arrears",
    message: "Your account is 7 days past due. Outstanding: KES 1,150 including penalties. Please pay immediately.",
  },
};

// Extension request options
export const extensionReasons = [
  "Seasonal business slowdown",
  "Medical emergency",
  "Stock supply delay",
  "Other",
];

export const extensionTerms = [
  "Extend tenure by 7 days",
  "Extend tenure by 14 days",
  "Grace period (interest only)",
];

// Profile Center — badges, redemptions, documents
export const badges = [
  { id: 1, name: "First Loan", icon: "🌱", earned: true, pts: 50 },
  { id: 2, name: "On-Time Streak", icon: "⚡", earned: true, pts: 100 },
  { id: 3, name: "4 Cycles Done", icon: "🔁", earned: true, pts: 200 },
  { id: 4, name: "Top Borrower", icon: "🏆", earned: false, pts: 500 },
  { id: 5, name: "6-Month Club", icon: "📅", earned: false, pts: 300 },
  { id: 6, name: "Market Leader", icon: "🌟", earned: false, pts: 400 },
];

export const pointRedemptions = [
  { label: "Reduced processing fee", cost: 200 },
  { label: "Priority approval review", cost: 400 },
  { label: "Airtime top-up (KES 50)", cost: 100 },
  { label: "Clearance certificate (free)", cost: 0 },
];

export const statementDownloads = [
  { label: "Loan & Savings Statement", sub: "Up to date - Aug 2026", icon: "📊" },
  { label: "Clearance Certificate", sub: "Issued when fully paid", icon: "📜" },
];

export const uploadedDocuments = [
  { type: "National ID", date: "15 Mar 2026", status: "Verified" },
  { type: "Profile Photo", date: "15 Mar 2026", status: "Stored" },
  { type: "M-Pesa Statement", date: "1 Jun 2026", status: "Reviewed" },
];