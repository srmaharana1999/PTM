import { AuthRequest, ProjectRole, SprintStatus } from "../lib/types";
import { Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { requireMembership } from "../utils/membership";
import Sprint from "../models/sprint.modal";

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

export const getSprints = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const sprints = await Sprint.find({ projectId });

  if (sprints.length == 0) {
    throw new AppError("No Sprints found", 403);
  }

  return res
    .status(201)
    .json({ message: "Sprints fetched successfully", data: sprints });
};
