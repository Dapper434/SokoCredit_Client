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

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function login(email, password) {
  return apiRequest("/api/auth/login", {
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
