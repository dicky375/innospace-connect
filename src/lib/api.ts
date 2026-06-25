import axios from "axios";

// ── Service URLs ───────────────────────────────────────────────
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:3001";
const REG_URL = import.meta.env.VITE_REG_URL || "http://localhost:3002";
const PAY_URL = import.meta.env.VITE_PAY_URL || "http://localhost:3003";

// ── Service URL constants ──────────────────────────────────────
export const AUTH = `${AUTH_URL}/api/auth`;
export const USERS = `${AUTH_URL}/api/users`;
export const PROGRAMS = `${REG_URL}/api/programs`;
export const REGISTRATIONS = `${REG_URL}/api/registrations`;
export const STATS = `${REG_URL}/api/stats`;
export const PAYMENTS = `${PAY_URL}/api/payments`;
export const COMMISSIONS = `${PAY_URL}/api/commissions`;
export const PAYOUTS = `${PAY_URL}/api/payouts`;
export const CONFIG = `${REG_URL}/api/config`;

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