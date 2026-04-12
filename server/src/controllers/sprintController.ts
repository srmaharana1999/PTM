import { AuthRequest, ProjectRole, SprintStatus } from "../lib/types";
import { Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { requireMembership } from "../utils/membership";
import Sprint from "../models/sprint.model";

export const createSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { name, projectId, startDate, endDate, status, tasks = [] } = req.body;

  if (!name || !projectId || !startDate || !endDate || !status) {
    throw new AppError(
      "All fields are required: name, projectId, startDate, endDate & status.",
      400,
    );
  }

  if (!Object.values(SprintStatus).includes(status)) {
    throw new AppError(
      `Invalid priority. Allowed: ${Object.values(SprintStatus).join(", ")}.`,
      400,
    );
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError("Only project owners and admins can create tasks.", 403);
  }

  const sprint = await Sprint.create({
    name,
    projectId,
    startDate,
    endDate,
    status,
    tasks,
  });

  return res
    .status(201)
    .json({ message: "Sprint Created Successfully", data: sprint });
};

export const getProjectSprints = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const sprints = await Sprint.find({ projectId });

  if (sprints.length === 0) {
    throw new AppError("No Sprints found for this project.", 404);
  }

  return res
    .status(200)
    .json({ message: "Sprints fetched successfully", data: sprints });
};

export const getActiveSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }
  const sprint = await Sprint.findOne({ projectId, status: SprintStatus.ACTIVE });

  if (!sprint) {
    throw new AppError("No Active Sprint found.", 404);
  }

  return res
    .status(200)
    .json({ message: "Active Sprint fetched successfully", data: sprint });
};

export const startSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const { sprintId } = req.body;

  if (!sprintId || typeof sprintId !== "string") {
    throw new AppError(
      "Sprint ID/Details is required and must be a string.",
      400,
    );
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError(
      "Only project owners and admins can update status.",
      403,
    );
  }

  const existingActive = await Sprint.findOne({
    projectId,
    status: SprintStatus.ACTIVE,
  });

  if (existingActive) {
    throw new AppError(
      "A sprint is already active. Complete it before starting a new one.",
      400,
    );
  }

  const activatedSprint = await Sprint.findOneAndUpdate(
    {
      _id: sprintId,
      projectId,
    },
    {
      status: SprintStatus.ACTIVE,
    },
    { new: true },
  );

  if (!activatedSprint) {
    throw new AppError("Sprint not found in this project.", 404);
  }

  return res
    .status(200)
    .json({ message: "Sprint started successfully.", data: activatedSprint });
};

export const completeSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const { sprintId } = req.body;

  if (!sprintId || typeof sprintId !== "string") {
    throw new AppError(
      "Sprint ID/Details is required and must be a string.",
      400,
    );
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError(
      "Only project owners and admins can update status.",
      403,
    );
  }

  const completedSprint = await Sprint.findOneAndUpdate(
    {
      _id: sprintId,
      projectId,
    },
    {
      status: SprintStatus.COMPLETED,
    },
    { new: true },
  );

  if (!completedSprint) {
    throw new AppError("Sprint not found in this project.", 404);
  }

  return res
    .status(200)
    .json({ message: "Sprint completed successfully.", data: completedSprint });
};

export const addTasksToSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const { taskIds, sprintId } = req.body;

  if (!sprintId || typeof sprintId !== "string") {
    throw new AppError(
      "Sprint ID/Details is required and must be a string.",
      400,
    );
  }

  if (!taskIds || !Array.isArray(taskIds)) {
    throw new AppError("taskIds must be a non-empty array.", 400);
  }

  if (taskIds.length === 0) {
    throw new AppError("At least one task is required.", 400);
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError(
      "Only project owners and admins can add tasks in sprint.",
      403,
    );
  }

  const targetSprint = await Sprint.findOne({ _id: sprintId, projectId });

  if (!targetSprint) {
    throw new AppError("Sprint not found in this project.", 404);
  }

  targetSprint.tasks = [...targetSprint.tasks, ...taskIds];

  const updatedSprint = await targetSprint.save();

  return res.status(200).json({
    message: "Tasks added to sprint successfully.",
    data: updatedSprint,
  });
};

export const deleteSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const { sprintId } = req.body;

  if (!sprintId || typeof sprintId !== "string") {
    throw new AppError(
      "Sprint ID/Details is required and must be a string.",
      400,
    );
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError("Only project owners and admins can delete sprint.", 403);
  }

  const deletionResult = await Sprint.deleteOne({
    _id: sprintId,
    projectId,
  });

  if (deletionResult.deletedCount === 0) {
    throw new AppError("Sprint not found or already deleted.", 404);
  }

  return res
    .status(200)
    .json({ message: "Sprint deleted successfully.", data: deletionResult });
};
