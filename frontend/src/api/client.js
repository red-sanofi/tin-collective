import i18n from "../i18n";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function getLanguageHeader() {
  const language = i18n.language || "tr";
  return language.startsWith("en") ? "en" : "tr";
}

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": getLanguageHeader(),
      ...getAuthHeaders(),
      ...options.headers,
    },
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
  createEducation: (payload) =>
    request("/educations/", { method: "POST", body: JSON.stringify(payload) }),
  updateEducation: (slug, payload) =>
    request(`/educations/${slug}/`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteEducation: (slug) =>
    request(`/educations/${slug}/`, { method: "DELETE" }),
  registerForEducation: (slug) =>
    request(`/educations/${slug}/register/`, { method: "POST" }),
  cancelEducationRegistration: (slug) =>
    request(`/educations/${slug}/register/`, { method: "DELETE" }),
  myRegistrations: () => request("/educations/mine/"),

  getAnnouncements: () => request("/announcements/"),
  getAnnouncement: (slug) => request(`/announcements/${slug}/`),
  createAnnouncement: (payload) =>
    request("/announcements/", { method: "POST", body: JSON.stringify(payload) }),
  updateAnnouncement: (slug, payload) =>
    request(`/announcements/${slug}/`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteAnnouncement: (slug) =>
    request(`/announcements/${slug}/`, { method: "DELETE" }),

  submitJoinApplication: (payload) =>
    request("/join/", { method: "POST", body: JSON.stringify(payload) }),

  getOAuthProviders: () => request("/auth/oauth/providers/"),

  getSocialFeed: () => request("/social/feed/"),
  getMySocialPosts: () => request("/social/mine/"),
  addSocialPost: (postUrl) =>
    request("/social/posts/", { method: "POST", body: JSON.stringify({ post_url: postUrl }) }),
  deleteSocialPost: (id) => request(`/social/posts/${id}/`, { method: "DELETE" }),
};
