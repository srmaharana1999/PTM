import axios from "axios";
import { store } from "../app/store";
import { logout, setAccessToken } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
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

let isRefreshing = false;
let queue: any[] = [];

const resolveQueue = (error: any, token: string | null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh token for login/register endpoints
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // console.log('🔄 CLIENT: Access token expired, starting refresh...');

      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;

        // console.log('✅ CLIENT: Received new access token (first 30 chars):', newToken.substring(0, 100) + '...');
        // console.log('🔄 CLIENT: Retrying', queue.length + 1, 'queued request(s)');

        store.dispatch(setAccessToken(newToken));
        resolveQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        console.log("❌ CLIENT: Token refresh failed, logging out");
        resolveQueue(err, null);
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
