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

// User Interface

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Session Interface
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

// Interface for Task

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface ITask extends Document {
  title: string;
  description: string;
  projectId: mongoose.Types.ObjectId;
  assigneeId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Project

export enum ProjectStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

export interface IProject extends Document {
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
  owner: mongoose.Types.ObjectId;
}

// Interface For Comments

export interface IComment extends Document {
  task: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project Member

export enum ProjectRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export interface IProjectMember extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  role: ProjectRole;
}

// Sprint

export enum SprintStatus {
  PLANNED = "planned",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export interface ISprint extends Document {
  name: string;
  projectId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  tasks: mongoose.Types.ObjectId[];
}
