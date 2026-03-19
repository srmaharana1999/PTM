import { AuthRequest, ProjectRole, ProjectStatus } from "../lib/types";
import { Response } from "express";
import { Project } from "../models/project.model";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectMember.model";
import Task from "../models/task.model";
import { AppError } from "../middlewares/errorHandler";

// ─── Create Project ───────────────────────────────────────────────────────────

export const createProject = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const { title, description, members } = req.body;

    if (!title || !description) {
      throw new AppError("Title and description are required.", 400);
    }

    // [1] Create the project
    const projects = await Project.create(
      [{ title, description, status: "active", owner: userId }],
      { session },
    );
    const createdProject = projects[0];

    // [2] Build member entries — creator is always OWNER
    const memberEntries = [
      {
        project: createdProject._id,
        user: new mongoose.Types.ObjectId(userId),
        role: ProjectRole.OWNER,
      },
    ];

    if (members && members.length > 0) {
      members.forEach((memberId: string) => {
        if (memberId !== userId) {
          memberEntries.push({
            project: createdProject._id,
            user: new mongoose.Types.ObjectId(memberId),
            role: ProjectRole.MEMBER,
          });
        }
      });
    }

    await ProjectMember.insertMany(memberEntries, { session });

    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
      message: "Project created successfully.",
      createdProject,
    });
  } catch (error) {
    // Must abort before forwarding — transaction must be cleaned up
    await session.abortTransaction();
    await session.endSession();
    throw error; // Re-throw so globalErrorHandler handles the response
  }
};

// ─── Get All Projects (user's own) ───────────────────────────────────────────

export const getProjects = async (req: AuthRequest, res: Response) => {
  const loggedInUserId = req.user?.userId;
  if (!loggedInUserId) throw new AppError("Unauthorized", 401);

  const memberships = await ProjectMember.find({
    user: loggedInUserId,
  }).select("project");

  const projectIds = memberships.map((m) => m.project);

  const projects = await Project.find({ _id: { $in: projectIds } }).populate(
    "owner",
    "name email",
  );

  return res
    .status(200)
    .json({ message: "Projects fetched successfully.", data: projects });
};

// ─── Get Project By ID ────────────────────────────────────────────────────────

export const getProjectById = async (req: AuthRequest, res: Response) => {
  if (!req.user?.userId) throw new AppError("Unauthorized", 401);

  const projectId = req.params.id;

  const projectDetails = await Project.findById(projectId).populate(
    "owner",
    "name email",
  );

  if (!projectDetails) {
    throw new AppError("Project not found.", 404);
  }

  return res
    .status(200)
    .json({ message: "Project fetched successfully.", data: projectDetails });
};

// ─── Delete Project By ID ─────────────────────────────────────────────────────

export const deleteProjectById = async (req: AuthRequest, res: Response) => {
  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const projectId = req.params.id;

    const result = await Project.deleteOne(
      { _id: projectId, owner: userId },
      { session: mongoSession },
    );

    if (result.deletedCount === 0) {
      throw new AppError(
        "Project not found or you are not authorised to delete it.",
        404,
      );
    }

    // Cascade delete related records
    await ProjectMember.deleteMany(
      { project: projectId },
      { session: mongoSession },
    );
    await Task.deleteMany({ projectId }, { session: mongoSession });

    await mongoSession.commitTransaction();
    await mongoSession.endSession();

    return res
      .status(200)
      .json({ message: "Project deleted successfully.", result });
  } catch (error) {
    await mongoSession.abortTransaction();
    await mongoSession.endSession();
    throw error; // Re-throw so globalErrorHandler handles the response
  }
};

// ─── Update Project ───────────────────────────────────────────────────────────

export const updateProject = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const projectId = req.params.pid;
    const { title, description, status, members } = req.body;
    console.log(req.body);

    if (status && !Object.values(ProjectStatus).includes(status)) {
      throw new AppError(
        "Invalid status value. Allowed: active, completed.",
        400,
      );
    }

    // ─── Member diff-sync ────────────────────────────────────────────────────
    if (Array.isArray(members)) {
      // Fetch all current members for this project
      const existingMembers = await ProjectMember.find({
        project: projectId,
      }).session(session);

      const existingMemberIds = existingMembers.map((m) =>
        m.user.toString(),
      );

      // Owner is always protected — never add/remove them via this path
      const ownerEntry = existingMembers.find(
        (m) => m.role === ProjectRole.OWNER,
      );
      const ownerIdStr = ownerEntry?.user.toString();

      // IDs to ADD: in incoming list, not yet in DB, and not the owner
      const toAdd = members.filter(
        (id: string) => !existingMemberIds.includes(id) && id !== ownerIdStr,
      );

      // IDs to REMOVE: currently in DB but not in incoming list (skip owner)
      const toRemove = existingMemberIds.filter(
        (id) => !members.includes(id) && id !== ownerIdStr,
      );

      if (toAdd.length > 0) {
        const newEntries = toAdd.map((memberId: string) => ({
          project: projectId,
          user: new mongoose.Types.ObjectId(memberId),
          role: ProjectRole.MEMBER,
        }));
        await ProjectMember.insertMany(newEntries, { session });
      }

      if (toRemove.length > 0) {
        await ProjectMember.deleteMany(
          { project: projectId, user: { $in: toRemove } },
          { session },
        );
        // Also unassign their tasks in this project so they aren't orphaned
        await Task.updateMany(
          { projectId, assignee: { $in: toRemove } },
          { $unset: { assignee: "" } },
          { session },
        );
      }
    }

    // ─── Update project fields ────────────────────────────────────────────────
    const updateQuery: Record<string, unknown> = {};
    if (title) updateQuery.title = title;
    if (description) updateQuery.description = description;
    if (status) updateQuery.status = status;
    
    // members-only update is valid — don't require field changes
    const updatedProject =
      Object.keys(updateQuery).length > 0
        ? await Project.findOneAndUpdate(
            { _id: projectId, owner: userId },
            updateQuery,
            { new: true, session },
          )
        : await Project.findOne({ _id: projectId, owner: userId }).session(
            session,
          );

    if (!updatedProject) {
      throw new AppError("Project not found or you are not the owner.", 404);
    }

    console.log(updatedProject)

    await session.commitTransaction();
    await session.endSession();

    return res
      .status(200)
      .json({ message: "Project updated successfully.", data: updatedProject });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
