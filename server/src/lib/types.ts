import mongoose, { Document, Types } from "mongoose";
import { Request } from "express";

export interface IAccessTokenPayload {
  userId: string;
  email: string;
}

export interface IRefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ISession extends Document {
  user: Types.ObjectId;
  refreshToken: string;
  userAgent: string;
  ip?: string;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
