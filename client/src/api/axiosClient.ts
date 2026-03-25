import axios, { type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
import { store } from "../app/store";
import { logout, setAccessToken } from "../features/auth/authSlice";

const api = axios.create({
  // In dev: empty string → relative path → Vite proxy forwards to localhost:3000
  //         cookies are first-party (same origin as client) — no cross-origin cookie issues
  // In prod: set VITE_API_URL=https://ptm-production-1812.up.railway.app/api in your host env
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

// Attach access token to requests

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle refresh token on 401

interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError | null) => void;
}

let isRefreshing = false;
let queue: QueueItem[] = [];

const resolveQueue = (error: AxiosError | null, token: string | null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);

    // Don't try to refresh token for auth endpoints (login, register, refresh)
    // Critically: /auth/refresh must be excluded to prevent an infinite refresh loop
    // when initAuth() fires on app load with no cookie present.
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use raw axios (not the api instance) to avoid re-triggering this interceptor.
        // VITE_API_URL is the full server URL in prod; in dev the Vite proxy handles /api.
        const refreshUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/auth/refresh`
          : "/api/auth/refresh";
        const res = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;

        store.dispatch(setAccessToken(newToken));
        resolveQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        resolveQueue(err as AxiosError, null);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
