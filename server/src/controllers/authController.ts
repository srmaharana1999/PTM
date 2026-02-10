import { Request, Response } from "express";
import User from "../models/user.model";
import Session from "../models/session.model";
import { AuthRequest } from "../lib/types";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

const isProd = process.env.NODE_ENV === "production";

// REGISTER

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validation is now handled by middleware, but keep as fallback
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const user = await User.create({ name, email, password });

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    return res.status(201).json({
      message: "User registered successfully",
      user: userSafe,
    });
  } catch (error) {
    console.error("Registration error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Validation is now handled by middleware, but keep as fallback
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
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
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : ("lax" as const),
      path: "/",
      maxAge: REFRESH_TOKEN_EXPIRES_MS,
    });

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    return res.status(200).json({
      message: "Login Successful",
      accessToken,
      user: userSafe,
    });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    
    if (!token) {

      return res.status(401).json({ message: "No refresh token is provided" });
    }

    
    const payload = verifyRefreshToken(token);
    if (!payload) {
      
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    
    const session = await Session.findById(payload.sessionId);
    if (!session || !session.isValid) {
     
      return res
        .status(401)
        .json({ message: "Session invalid or does not exist" });
    }

    
    if (session.expiresAt.getTime() < Date.now()) {
  
      return res.status(401).json({ message: "Session expired" });
    }

    if (session.refreshToken !== token) {

      return res.status(401).json({ message: "Invalid token mismatch" });
    }

    
    const user = await User.findById(payload.userId);
    if (!user) {
     
      return res.status(401).json({ message: "User not found" });
    }

   

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

   

    return res.status(200).json({
      accessToken,
      user: userSafe,
    });
  } catch (error) {
    console.error("Refresh token error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGOUT

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const payload = verifyRefreshToken(token);

      if (payload) {
        await Session.findByIdAndUpdate(payload.sessionId, {
          isValid: false,
        });
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : ("lax" as const),
      path: "/",
      maxAge: 0,
    });

    return res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    console.error("Logout error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// CURRENT USER

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    return res.status(200).json({ user: userSafe });
  } catch (error) {
    console.error("getMe error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
