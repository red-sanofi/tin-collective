import Constants from "expo-constants";
import i18n from "../i18n";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./storage";

const API_BASE = (
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

function getLanguageHeader() {
  const language = i18n.language || "tr";
  return language.startsWith("en") ? "en" : "tr";
}

async function getAuthHeaders() {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
  const refresh = await getRefreshToken();
  if (!refresh) {
    throw new Error("No refresh token");
  }
  const response = await fetch(`${API_BASE}/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": getLanguageHeader(),
    },
    body: JSON.stringify({ refresh }),
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }
  if (!response.ok) {
    await clearTokens();
    const error = new Error(data?.detail || "Session expired");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  await setTokens(data.access, refresh);
  return data.access;
}

async function request(path, options = {}, retry = true) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": getLanguageHeader(),
      ...(await getAuthHeaders()),
      ...options.headers,
    },
  });

  if (response.status === 401 && retry) {
    try {
      await refreshAccessToken();
      return request(path, options, false);
    } catch {
      // fall through to error handling below
    }
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }

  if (!response.ok) {
    const error = new Error(data?.detail || i18n.t("errors.requestFailed"));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register/", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/auth/login/", { method: "POST", body: JSON.stringify(payload) }),
  refresh: (refreshToken) =>
    request("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    }),
  me: () => request("/auth/me/"),
  updateMe: (payload) =>
    request("/auth/me/", { method: "PATCH", body: JSON.stringify(payload) }),

  getEducations: (params = "") => request(`/educations/${params}`),
  getEducation: (slug) => request(`/educations/${slug}/`),
  registerForEducation: (slug) =>
    request(`/educations/${slug}/register/`, { method: "POST" }),
  cancelEducationRegistration: (slug) =>
    request(`/educations/${slug}/register/`, { method: "DELETE" }),
  myRegistrations: () => request("/educations/mine/"),

  getAnnouncements: () => request("/announcements/"),
  getAnnouncement: (slug) => request(`/announcements/${slug}/`),

  submitJoinApplication: (payload) =>
    request("/join/", { method: "POST", body: JSON.stringify(payload) }),

  getSiteSettings: () => request("/site/settings/"),
};

export { API_BASE };
