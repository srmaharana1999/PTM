import { Request, Response } from "express";
import User from "../models/user.model";
import Session from "../models/session.model";
import { AuthRequest } from "../lib/types";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AppError } from "../middlewares/errorHandler";

const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === "production";

// ─── Cookie Options Helper ────────────────────────────────────────────────────

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  path: "/",
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validation middleware runs first, but kept as a safety fallback
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required.", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already in use.", 409);
  }

  const user = await User.create({ name, email, password });

  const userSafe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };

  return res.status(201).json({
    message: "User registered successfully",
    user: userSafe,
  });
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation middleware runs first, but kept as a safety fallback
  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    // Generic message — prevents user enumeration
    throw new AppError("Invalid credentials.", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid credentials.", 401);
  }

  const userAgent = req.headers["user-agent"] || "";
  const ip =
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    req.ip ||
    "";

  const session = await Session.create({
    user: user._id,
    refreshToken: "temp",
    userAgent,
    ip,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
  });

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
  });

  const refreshToken = signRefreshToken({
    userId: user._id.toString(),
    sessionId: session._id.toString(),
  });

  session.refreshToken = refreshToken;
  await session.save();

  res.cookie("refreshToken", refreshToken, {
    ...refreshCookieOptions,
    maxAge: REFRESH_TOKEN_EXPIRES_MS,
  });

  const userSafe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };

  return res.status(200).json({
    message: "Login successful",
    accessToken,
    user: userSafe,
  });
};

// ─── Refresh Access Token ─────────────────────────────────────────────────────

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new AppError("No refresh token provided.", 401);
  }

  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new AppError("Invalid or expired refresh token.", 401);
  }

  const session = await Session.findById(payload.sessionId);
  if (!session || !session.isValid) {
    throw new AppError("Session is invalid or does not exist.", 401);
  }

  if (session.expiresAt.getTime() < Date.now()) {
    throw new AppError("Session has expired.", 401);
  }

  if (session.refreshToken !== token) {
    // Token reuse detected — potential theft
    await Session.findByIdAndUpdate(payload.sessionId, { isValid: false });
    throw new AppError("Token mismatch detected. Please log in again.", 401);
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
  });

  const userSafe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };

  return res.status(200).json({ accessToken, user: userSafe });
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    const payload = verifyRefreshToken(token);
    if (payload) {
      await Session.findByIdAndUpdate(payload.sessionId, { isValid: false });
    }
  }

  res.clearCookie("refreshToken", { ...refreshCookieOptions, maxAge: 0 });

  return res.status(200).json({ message: "Logged out successfully." });
};

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const userSafe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };

  return res.status(200).json({ user: userSafe });
};

// ─── Change Password ──────────────────────────────────────────────────────────

export const changePassword = async (req: AuthRequest, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError("Unauthorized", 401);
  }

  const { currPassword, newPassword } = req.body;

  if (!currPassword || !newPassword) {
    throw new AppError("Current password and new password are required.", 400);
  }

  const user = await User.findById(req.user.userId).select("+password");
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isMatch = await user.comparePassword(currPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect.", 400);
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({ message: "Password changed successfully." });
};
