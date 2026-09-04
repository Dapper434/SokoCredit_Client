const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const SESSION_KEY = "sokocredit_session";

function formatApiError(data, fallback) {
  if (typeof data.error === "string") return data.error;
  if (data.details) {
    return Object.values(data.details).flat().join(", ");
  }
  return fallback;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatApiError(data, "Request failed"));
  }

  return data;
}

export const saveSession = (token, user) => {
  localStorage.setItem('soko_token', token);
  localStorage.setItem('soko_user', JSON.stringify(user));
};

export const getSession = () => {
  const token = localStorage.getItem('soko_token');
  const user = localStorage.getItem('soko_user');

  // Auto-clear corrupted sessions: a valid JWT has 3 dot-separated segments.
  // The old saveSession(data) bug stored "[object Object]" as the token.
  if (token && (typeof token !== 'string' || token.split('.').length !== 3)) {
    console.warn("Corrupted session token detected. Auto-clearing.");
    clearSession();
    return { token: null, user: null };
  }

  let parsedUser = null;
  
  if (user) {
    try {
      parsedUser = JSON.parse(user);
    } catch (e) {
      // If parsing fails, the session is corrupted (e.g. from previous bugs)
      console.error("Corrupted session data. Clearing session.");
      clearSession();
      return { token: null, user: null };
    }
  }
  
  return {
    token,
    user: parsedUser,
  };
};

export const clearSession = () => {
  localStorage.removeItem('soko_token');
  localStorage.removeItem('soko_user');
  clearCustomerOnboardingSession();
};

export const clearCustomerOnboardingSession = () => {
  // Clear all sessionStorage keys used during customer onboarding (prefixed with 'cus_')
  try {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('cus_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => sessionStorage.removeItem(k));
  } catch (e) {
    console.warn("Failed to clear customer onboarding session storage", e);
  }
};

export function login(email, password) {
  return apiRequest("/api/auth/lender/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signupOrganization(payload) {
  return apiRequest("/api/auth/institutions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function toOrganizationSlug(name, registrationNumber = "") {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = registrationNumber
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base && suffix) return `${base}-${suffix}`;
  return base || suffix || "organization";
}
export function customerLogin(phone_number, pin, lending_institution_id) {
  return apiRequest("/api/origination/customers/login", {
    method: "POST",
    body: JSON.stringify({ phone_number, pin, lending_institution_id }),
  });
}

export function customerRegister(payload) {
  return apiRequest("/api/origination/customers/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function getAuthHeaders() {
  const session = getSession();
  // Validate token looks like a JWT (3 dot-separated base64 segments)
  // to prevent sending corrupted values like "[object Object]"
  if (session?.token && typeof session.token === 'string' && session.token.includes('.')) {
    return { Authorization: `Bearer ${session.token}` };
  }
  return {};
}

export function getMyLoans() {
  return apiRequest("/api/underwriting/loans/my", {
    headers: getAuthHeaders(),
  });
}

export function getCustomerSchedule(loanId) {
  return apiRequest(`/api/servicing/loans/${loanId}/schedule`, {
    headers: getAuthHeaders(),
  });
}

// ── M-Pesa STK ─────────────────────────────────────────────────────────
export function initiateRepaymentStk(loanId) {
  return apiRequest(`/api/servicing/loans/${loanId}/repayment/stk`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export function getTransactionStatus(checkoutRequestId) {
  return apiRequest(`/api/servicing/transactions/${checkoutRequestId}`, {
    headers: getAuthHeaders(),
  });
}

export function initiateSavingsStk() {
  return apiRequest("/api/origination/customers/savings/stk", {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export function getSavingsDepositStatus(checkoutRequestId) {
  return apiRequest(`/api/origination/customers/savings/deposits/${checkoutRequestId}`, {
    headers: getAuthHeaders(),
  });
}

// Dev-only (Phase 3C): drive a fake Daraja callback when there's no tunnel.
export function simulateMpesaCallback(checkoutRequestId, resultCode = 0) {
  return apiRequest("/api/servicing/webhooks/mpesa/simulate", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ checkout_request_id: checkoutRequestId, result_code: resultCode }),
  });
}

export function getSavingsActivity() {
  return apiRequest("/api/origination/savings/activity", {
    headers: getAuthHeaders(),
  });
}

export function makeRepayment(loanId, payload) {
  return apiRequest(`/api/servicing/loans/${loanId}/repayment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function getStaffMembers() {
  return apiRequest("/api/auth/users", {
    headers: getAuthHeaders(),
  });
}

export function addStaffMember(payload) {
  return apiRequest("/api/auth/users", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateStaffStatus(userId, status) {
  return apiRequest(`/api/auth/users/${userId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
}

export function submitStaffEditRequest(userId, payload) {
  return apiRequest(`/api/auth/users/${userId}/edit-request`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function applyForLoan(payload) {
  return apiRequest("/api/underwriting/applications", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function getAvailableCredit(customerProfileId) {
  return apiRequest(`/api/underwriting/customers/${customerProfileId}/available-credit`, {
    headers: getAuthHeaders(),
  });
}

export function getPendingApplications() {
  return apiRequest("/api/underwriting/applications/pending", {
    headers: getAuthHeaders(),
  });
}

export function getActiveLoans() {
  return apiRequest("/api/servicing/loans/active", {
    headers: getAuthHeaders(),
  });
}

export function getPaidLoans() {
  return apiRequest("/api/servicing/loans/paid", {
    headers: getAuthHeaders(),
  });
}

export function approveLoan(loanId, payload = {}) {
  return apiRequest(`/api/underwriting/loans/${loanId}/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function rejectLoan(loanId, payload = {}) {
  return apiRequest(`/api/underwriting/loans/${loanId}/reject`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function disburseLoan(loanId) {
  return apiRequest(`/api/underwriting/loans/${loanId}/disburse`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

// ── Savings Check-in APIs ──────────────────────────────────────────────

export function recordCheckin() {
  return apiRequest("/api/origination/customers/checkin", {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export function getCheckins() {
  return apiRequest("/api/origination/customers/checkins", {
    headers: getAuthHeaders(),
  });
}

// ── Loan Terms API ─────────────────────────────────────────────────────

// Pass { amount, term_days, repayment_frequency } to also get a priced quote,
// computed by the same backend function that generates the repayment schedule.
export function getLoanTerms(params) {
  const query = params ? `?${new URLSearchParams(params)}` : "";
  return apiRequest(`/api/underwriting/loan-terms${query}`, {
    headers: getAuthHeaders(),
  });
}

// ── SokoPoints API ─────────────────────────────────────────────────────

export function getMyPoints() {
  return apiRequest("/api/origination/customers/points", {
    headers: getAuthHeaders(),
  });
}

// ── Customer Profile API ───────────────────────────────────────────────

export function getMyProfile() {
  const session = getSession();
  const profileId = session?.user?.customer_profile_id;
  if (!profileId) return Promise.reject(new Error("No customer profile ID in session."));
  return apiRequest(`/api/origination/customers/${profileId}`, {
    headers: getAuthHeaders(),
  });
}

export function getCustomers() {
  return apiRequest("/api/origination/customers", {
    headers: getAuthHeaders(),
  });
}

export function updateMyProfile(payload) {
  const session = getSession();
  const profileId = session?.user?.customer_profile_id;
  if (!profileId) return Promise.reject(new Error("No customer profile ID in session."));
  return apiRequest(`/api/origination/customers/${profileId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

// ── Institution Settings APIs ──────────────────────────────────────────

export function getInstitutionSettings() {
  return apiRequest("/api/auth/institution-settings", {
    headers: getAuthHeaders(),
  });
}

export function getSettingRequests() {
  return apiRequest("/api/auth/institution-setting-requests", {
    headers: getAuthHeaders(),
  });
}

export function submitSettingChangeRequest(payload) {
  return apiRequest("/api/auth/institution-setting-requests", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}
