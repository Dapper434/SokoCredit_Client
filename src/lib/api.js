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
  // MOCKED fallback — only hit if user is not in the staff roster
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "mock-jwt-token-12345",
        user: {
          id: 1,
          email: email,
          name: email.split("@")[0],
          role: "super_admin",
        },
        organization: {
          id: 1,
          name: "Mock Organization",
          slug: "mock-org",
        }
      });
    }, 800);
  });
}

export function signupOrganization(payload) {
  // MOCKED for now since backend is not up yet
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "mock-jwt-token-12345",
        user: {
          id: 1,
          email: payload.admin_email,
          name: payload.admin_full_name,
          role: "super_admin",
        },
        organization: {
          id: 1,
          name: payload.name,
          slug: payload.slug,
        }
      });
    }, 1500);
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
