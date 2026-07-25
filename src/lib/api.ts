import axios from "axios";

// ── Service URL ────────────────────────────────────────────────
// Now using a single URL for the monolith
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ── API Endpoints ──────────────────────────────────────────────
export const AUTH = `${API_URL}/api/auth`;
export const USERS = `${API_URL}/api/users`;
export const PROGRAMS = `${API_URL}/api/programs`;
export const REGISTRATIONS = `${API_URL}/api/registrations`;
export const PAYMENTS = `${API_URL}/api/payments`;
export const COMMISSIONS = `${API_URL}/api/commissions`;
export const PAYOUTS = `${API_URL}/api/payouts`;
export const CONFIG = `${API_URL}/api/config`;

// ── Axios instance ─────────────────────────────────────────────
const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

// ── Token refresh queue ────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ── Request interceptor — attach access token ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — handle token expiry ─────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(`${AUTH}/refresh`, {
          refreshToken,
        });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ===== AUTH ENDPOINTS =====
export const authApi = {
  register: (data) => api.post(`${AUTH}/register`, data),
  login: (data) => api.post(`${AUTH}/login`, data),
  refresh: (data) => api.post(`${AUTH}/refresh`, data),
  logout: (data) => api.post(`${AUTH}/logout`, data),
  me: () => api.get(`${AUTH}/me`),
};

// ===== USER ENDPOINTS =====
export const usersApi = {
  getAll: () => api.get(USERS),
  getById: (id) => api.get(`${USERS}/${id}`),
  update: (id, data) => api.patch(`${USERS}/${id}`, data),
};

// ===== PROGRAM ENDPOINTS =====
export const programsApi = {
  getAll: () => api.get(PROGRAMS),
  getById: (id) => api.get(`${PROGRAMS}/${id}`),
  create: (data) => api.post(PROGRAMS, data),
  update: (id, data) => api.patch(`${PROGRAMS}/${id}`, data),
  delete: (id) => api.delete(`${PROGRAMS}/${id}`),
  getStats: () => api.get(`${PROGRAMS}/stats/summary`),
};

// ===== REGISTRATION ENDPOINTS =====
export const registrationsApi = {
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post(REGISTRATIONS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getMy: () => api.get(`${REGISTRATIONS}/my`),
  getMyStats: () => api.get(`${REGISTRATIONS}/my/stats`),
  getPending: () => api.get(`${REGISTRATIONS}/pending`),
  getAll: () => api.get(`${REGISTRATIONS}/all`),
  getById: (id) => api.get(`${REGISTRATIONS}/${id}`),
  approve: (id) => api.patch(`${REGISTRATIONS}/${id}/approve`),
  reject: (id, reason) => api.patch(`${REGISTRATIONS}/${id}/reject`, { reason }),
  cancel: (id) => api.patch(`${REGISTRATIONS}/${id}/cancel`),
};

// ===== PAYMENT ENDPOINTS =====
export const paymentsApi = {
  initialize: (data) => api.post(`${PAYMENTS}/initialize`, data),
  verify: (reference) => api.get(`${PAYMENTS}/verify/${reference}`),
  getTransactions: () => api.get(`${PAYMENTS}/transactions`),
  getAllTransactions: () => api.get(`${PAYMENTS}/transactions/all`),
};

// ===== COMMISSION ENDPOINTS =====
export const commissionsApi = {
  getBalance: () => api.get(`${COMMISSIONS}/balance`),
  getLeaderboard: (limit = 10) => api.get(`${COMMISSIONS}/leaderboard?limit=${limit}`),
};

// ===== PAYOUT ENDPOINTS =====
export const payoutsApi = {
  request: (data) => api.post(`${PAYOUTS}/request`, data),
  getMy: () => api.get(`${PAYOUTS}/my`),
  getPending: () => api.get(`${PAYOUTS}/pending`),
  getAll: () => api.get(`${PAYOUTS}/all`),
  approve: (id) => api.patch(`${PAYOUTS}/${id}/approve`),
  reject: (id, reason) => api.patch(`${PAYOUTS}/${id}/reject`, { reason }),
};

// ===== CONFIG ENDPOINTS =====
export const configApi = {
  getCommission: () => api.get(`${CONFIG}/commission`),
  updateCommission: (data) => api.patch(`${CONFIG}/commission`, data),
};

export default api;