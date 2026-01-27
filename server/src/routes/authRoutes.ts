import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  getMe,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController";
import {
  loginLimiter,
  registerLimiter,
  authLimiter,
} from "../middlewares/rateLimiter";
import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validation";

const router = Router();

// /api/auth/register
router.post("/register", registerLimiter, validateRegistration, register);

// /api/auth/login
router.post("/login", loginLimiter, validateLogin, login);

// /api/auth/refresh
router.post("/refresh", authLimiter, refreshAccessToken);

// /api/auth/logout
router.post("/logout", authLimiter, logout);

// /api/auth/me
router.get("/me", requireAuth, getMe);

export default router;
