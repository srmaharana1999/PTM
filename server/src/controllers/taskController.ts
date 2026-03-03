import mongoose from "mongoose";
import {
  AuthRequest,
  ProjectRole,
  TaskPriority,
  TaskStatus,
} from "../lib/types";
import { Response, Request } from "express";
import Task from "../models/task.model";
import { ProjectMember } from "../models/projectMember.model";
import { AppError } from "../middlewares/errorHandler";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolves the project membership for a user, throwing if not a member. */
const requireMembership = async (userId: string, projectId: string) => {
  const membership = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!membership) {
    throw new AppError("You are not a member of this project.", 403);
  }
  return membership;
};

// ─── Create Task ──────────────────────────────────────────────────────────────

export const createTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { title, description, priority, status, dueDate, assigneeId, projectId } =
    req.body;

  if (!title || !description || !priority || !status || !projectId || !assigneeId || !dueDate) {
    throw new AppError("All fields are required: title, description, priority, status, projectId, assigneeId, dueDate.", 400);
  }

  if (!Object.values(TaskPriority).includes(priority)) {
    throw new AppError(`Invalid priority. Allowed: ${Object.values(TaskPriority).join(", ")}.`, 400);
  }

  if (!Object.values(TaskStatus).includes(status)) {
    throw new AppError(`Invalid status. Allowed: ${Object.values(TaskStatus).join(", ")}.`, 400);
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError("Only project owners and admins can create tasks.", 403);
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    assigneeId,
    projectId,
    dueDate,
    createdBy: userId,
  });

  return res.status(201).json({ message: "Task created successfully.", task });
};

// ─── Get Tasks ────────────────────────────────────────────────────────────────

export const getTasks = async (req: Request, res: Response) => {
  const { projectId } = req.query;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId query parameter is required and must be a string.", 400);
  }

  const tasks = await Task.find({ projectId })
    .populate("projectId", "title")
    .populate("assigneeId", "name email")
    .populate("createdBy", "name email");

  return res
    .status(200)
    .json({ message: "Tasks fetched successfully.", tasks });
};

// ─── Update Task ──────────────────────────────────────────────────────────────

export const updateTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const taskId = req.params.id;
  const { projectId, ...updateBody } = req.body;

  if (!projectId) throw new AppError("projectId is required in the request body.", 400);

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError("Only project owners and admins can update tasks.", 403);
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedTask) {
    throw new AppError("Task not found.", 404);
  }

  return res
    .status(200)
    .json({ message: "Task updated successfully.", updatedTask });
};

// ─── Delete Task ──────────────────────────────────────────────────────────────

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const taskId = req.params.id;
  const { projectId } = req.body;

  if (!projectId) throw new AppError("projectId is required in the request body.", 400);

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError("Only project owners and admins can delete tasks.", 403);
  }

  const result = await Task.deleteOne({ _id: taskId, projectId });

  if (result.deletedCount === 0) {
    throw new AppError("Task not found.", 404);
  }

  return res.status(200).json({ message: "Task deleted successfully." });
};

// ─── Bulk Update / Delete Tasks ───────────────────────────────────────────────

export const updateTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { projectId, updates, deletes } = req.body;

  if (!projectId) throw new AppError("projectId is required.", 400);

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError("Only project owners and admins can perform bulk operations.", 403);
  }

  if (!Array.isArray(updates) || !Array.isArray(deletes)) {
    throw new AppError("Both 'updates' and 'deletes' must be arrays.", 400);
  }

  if (updates.length === 0 && deletes.length === 0) {
    throw new AppError("No operations provided. Send at least one update or delete.", 400);
  }

  const updateOps = updates.map((item) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(item.id), projectId },
      update: { $set: item.data },
    },
  }));

  const deleteOps = deletes.map((item) => ({
    deleteOne: {
      filter: { _id: new mongoose.Types.ObjectId(item.id), projectId },
    },
  }));

  const result = await Task.bulkWrite([...updateOps, ...deleteOps]);

  return res
    .status(200)
    .json({ message: "Bulk operation completed successfully.", result });
};
