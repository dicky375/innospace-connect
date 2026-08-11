// src/lib/api.ts
import axios from "axios";

// ── Service URL ────────────────────────────────────────────────
// ✅ FIX: Hardcode production URL
const API_URL = "https://innospace.onrender.com";

// ── API Endpoints ──────────────────────────────────────────────
export const AUTH = `${API_URL}/api/auth`;
export const USERS = `${API_URL}/api/users`;
export const PROGRAMS = `${API_URL}/api/programs`;
export const REGISTRATIONS = `${API_URL}/api/registrations`;
export const STATS = `${API_URL}/api/stats`;
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
let failedQueue: Array<{
  resolve: (v: unknown) => void;
  reject: (e: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
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

export default api;