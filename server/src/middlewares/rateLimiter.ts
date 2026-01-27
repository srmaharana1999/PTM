import rateLimit from "express-rate-limit";

// Get rate limit settings from environment or use defaults
const LOGIN_WINDOW_MS =
  parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || "") || 15 * 60 * 1000;
const LOGIN_MAX = parseInt(process.env.LOGIN_RATE_LIMIT_MAX || "") || 5;

const REGISTER_WINDOW_MS =
  parseInt(process.env.REGISTER_RATE_LIMIT_WINDOW_MS || "") || 60 * 60 * 1000;
const REGISTER_MAX = parseInt(process.env.REGISTER_RATE_LIMIT_MAX || "") || 3;

// Strict rate limiter for login attempts (prevent brute force)
export const loginLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS, // 15 minutes default
  max: LOGIN_MAX, // 5 attempts per window default
  message: {message:"Too many login attempts. Please try again after 15 minutes."},
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
});

// Moderate rate limiter for registration
export const registerLimiter = rateLimit({
  windowMs: REGISTER_WINDOW_MS, // 1 hour default
  max: REGISTER_MAX, // 3 registrations per hour per IP default
  message: {message:"Too many accounts created. Please try again after an hour."},
  standardHeaders: true,
  legacyHeaders: false,
});

// General auth endpoint limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {message:"Too many requests. Please try again later."},
  standardHeaders: true,
  legacyHeaders: false,
});
