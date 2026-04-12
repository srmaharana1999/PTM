import { AuthRequest, ProjectRole, SprintStatus } from "../lib/types";
import { Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { requireMembership } from "../utils/membership";
import Sprint from "../models/sprint.model";
import mongoose from "mongoose";
import Task from "../models/task.model";

export const createSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { name, projectId, startDate, endDate, status = SprintStatus.PLANNED, tasks = [] } = req.body;

  if (!name || !projectId || !startDate || !endDate) {
    throw new AppError(
      "All fields are required: name, projectId, startDate & endDate.",
      400,
    );
  }

  if (!Object.values(SprintStatus).includes(status)) {
    throw new AppError(
      `Invalid status. Allowed: ${Object.values(SprintStatus).join(", ")}.`,
      400,
    );
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError("Only project owners and admins can create sprints.", 403);
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
    .json({ message: "Sprint created successfully.", data: sprint });
};

export const getProjectSprints = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const sprints = await Sprint.find({ projectId }).sort({ startDate: 1 });

  return res
    .status(200)
    .json({ message: "Sprints fetched successfully.", data: sprints });
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

  const targetSprint = await Sprint.findOne({ _id: sprintId, projectId });

  if (!targetSprint) {
    throw new AppError("Sprint not found in this project.", 404);
  }

  if (targetSprint.status !== SprintStatus.ACTIVE) {
    throw new AppError("Only an active sprint can be marked as completed.", 400);
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

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    throw new AppError("taskIds must be a non-empty array.", 400);
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

  if (targetSprint.status === SprintStatus.COMPLETED) {
    throw new AppError("Cannot add tasks to a completed sprint.", 400);
  }

  // Deduplicate: avoid adding the same task twice
  const existingIds = new Set(targetSprint.tasks.map((id) => id.toString()));
  const newTaskIds = taskIds.filter((id: string) => !existingIds.has(id));

  if (newTaskIds.length === 0) {
    throw new AppError("All provided tasks are already in this sprint.", 400);
  }

  // Verify all tasks belong to this project
  const tasksInProjectCount = await Task.countDocuments({
    _id: { $in: newTaskIds },
    projectId,
  });

  if (tasksInProjectCount !== newTaskIds.length) {
    throw new AppError(
      "Some tasks do not belong to this project or do not exist.",
      400,
    );
  }

  targetSprint.tasks = [...targetSprint.tasks, ...newTaskIds];

  // Start transaction only for the write operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [updatedSprint] = await Promise.all([
      targetSprint.save({ session }),
      Task.updateMany(
        { _id: { $in: newTaskIds } },
        { sprintId: new mongoose.Types.ObjectId(sprintId) },
        { session },
      ),
    ]);

    await session.commitTransaction();

    return res.status(200).json({
      message: "Tasks added to sprint successfully.",
      data: updatedSprint,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletionResult = await Sprint.deleteOne(
      {
        _id: sprintId,
        projectId,
      },
      { session },
    );

    if (deletionResult.deletedCount === 0) {
      throw new AppError("Sprint not found or already deleted.", 404);
    }

    // Unset sprintId from all tasks associated with this deleted sprint
    await Task.updateMany(
      { sprintId: new mongoose.Types.ObjectId(sprintId) },
      { $unset: { sprintId: "" } },
      { session },
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: "Sprint deleted successfully.",
      data: deletionResult,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};


export const removeTasksFromSprint = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  if (!projectId || typeof projectId !== "string") {
    throw new AppError("projectId is required and must be a string.", 400);
  }

  const { taskIds: deleteTaskIds, sprintId } = req.body;

  if (!sprintId || typeof sprintId !== "string") {
    throw new AppError(
      "Sprint ID/Details is required and must be a string.",
      400,
    );
  }

  if (!Array.isArray(deleteTaskIds) || deleteTaskIds.length === 0) {
    throw new AppError("taskIds must be a non-empty array.", 400);
  }

  const membership = await requireMembership(userId, projectId);

  if (membership.role === ProjectRole.MEMBER) {
    throw new AppError(
      "Only project owners and admins can remove tasks from sprint.",
      403,
    );
  }

  const targetSprint = await Sprint.findOne({ _id: sprintId, projectId });

  if (!targetSprint) {
    throw new AppError("Sprint not found in this project.", 404);
  }

  if (targetSprint.status === SprintStatus.COMPLETED) {
    throw new AppError("Cannot remove tasks from a completed sprint.", 400);
  }

  const existingIds = new Set(targetSprint.tasks.map((id) => id.toString()));
  const deleteTaskIdsSet = new Set(deleteTaskIds.map((id: string) => id.toString()));

  // Check that at least some of the provided IDs actually exist in the sprint
  const validToRemove = [...deleteTaskIdsSet].filter((id) => existingIds.has(id));

  if (validToRemove.length === 0) {
    throw new AppError(
      "None of the provided tasks exist in this sprint.",
      400,
    );
  }

  // Build the updated task list (remaining tasks after removal)
  const remainingTaskIds = [...existingIds]
    .filter((id) => !deleteTaskIdsSet.has(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  targetSprint.tasks = remainingTaskIds;

  // Start transaction only for the write operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [updatedSprint] = await Promise.all([
      targetSprint.save({ session }),
      // Unset sprintId ONLY on the tasks being removed, not all sprint tasks
      Task.updateMany(
        { _id: { $in: validToRemove } },
        { $unset: { sprintId: "" } },
        { session },
      ),
    ]);

    await session.commitTransaction();

    return res.status(200).json({
      message: "Tasks removed from sprint successfully.",
      data: updatedSprint,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
