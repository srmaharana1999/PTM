import mongoose, { Types } from "mongoose";
import { AuthRequest, ProjectRole } from "../lib/types";
import { Response } from "express";
import { Project } from "../models/project.model";
import User from "../models/user.model";
import { ProjectMember } from "../models/projectMember.model";
import { AppError } from "../middlewares/errorHandler";

export interface Member {
  userId: string;
  role: "admin" | "member" | "owner";
}

// ─── Create Members ───────────────────────────────────────────────────────────

export const createMember = async (req: AuthRequest, res: Response) => {
  const { projectId, members } = req.body;
  const loggedInUserId = req.user?.userId;

  if (!loggedInUserId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!Array.isArray(members) || members.length === 0) {
    throw new AppError("members must be a non-empty array.", 400);
  }

  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid Project ID", 400);
  }

  // Check if project exists
  const projectExists = await Project.findById(projectId);
  if (!projectExists) {
    throw new AppError("Project not found", 404);
  }

  const userIds = members.map((m: Member) => m.userId);

  // Validate all users exist
  const existingUsers = await User.find({ _id: { $in: userIds } });
  if (existingUsers.length !== userIds.length) {
    throw new AppError("Some users are not registered", 400);
  }

  // Check for already-existing project members
  const alreadyMembers = await ProjectMember.find({
    project: projectId,
    user: { $in: userIds },
  });

  const alreadyMemberIds = alreadyMembers.map((m) => m.user.toString());

  // Filter out duplicates
  const newMembers: Member[] = members.filter(
    (m: Member) => !alreadyMemberIds.includes(m.userId),
  );

  if (newMembers.length === 0) {
    throw new AppError("All provided users are already members of this project", 409);
  }

  const bulkData = newMembers.map((m) => ({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(m.userId),
    role: m.role,
  }));

  const result = await ProjectMember.insertMany(bulkData);

  res.status(201).json({
    message: "Project members added successfully",
    result,
  });
};

// ─── Update Member Role ───────────────────────────────────────────────────────

export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  const loggedInUserId = req.user?.userId;
  const { projectId, memberId } = req.params;
  const { role: newRole } = req.body;

  if (!loggedInUserId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(memberId)) {
    throw new AppError("Invalid project ID or member ID", 400);
  }

  if (!newRole) {
    throw new AppError("New role is required.", 400);
  }

  const allowedRoles = [ProjectRole.ADMIN, ProjectRole.MEMBER];
  if (!allowedRoles.includes(newRole)) {
    throw new AppError(`Invalid role. Allowed: ${allowedRoles.join(", ")}.`, 400);
  }

  // Verify caller is the project OWNER
  const ownerMembership = await ProjectMember.findOne({
    project: projectId,
    user: loggedInUserId,
    role: ProjectRole.OWNER,
  });

  if (!ownerMembership) {
    throw new AppError("Only the project owner can update member roles", 403);
  }

  // Find the membership record to update
  const targetMembership = await ProjectMember.findById(memberId);
  if (!targetMembership) {
    throw new AppError("Member not found", 404);
  }

  // Prevent changing the owner's own role
  if (targetMembership.role === ProjectRole.OWNER) {
    throw new AppError("Cannot modify the project owner's role", 400);
  }

  targetMembership.role = newRole;
  await targetMembership.save();

  return res.status(200).json({
    message: "Role updated successfully",
    data: targetMembership,
  });
};

// ─── Delete Members ───────────────────────────────────────────────────────────

export const deleteMembers = async (req: AuthRequest, res: Response) => {
  const loggedInUserId = req.user?.userId;
  const { projectId } = req.params;
  const { members } = req.body;

  if (!loggedInUserId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project ID", 400);
  }

  if (!Array.isArray(members) || members.length === 0) {
    throw new AppError("Members array is required and must not be empty", 400);
  }

  // Filter to only valid ObjectId strings
  const validMemberIds = members.filter((id: string) =>
    Types.ObjectId.isValid(id),
  );

  if (validMemberIds.length === 0) {
    throw new AppError("No valid member IDs provided", 400);
  }

  // Verify caller is the project OWNER
  const ownerMembership = await ProjectMember.findOne({
    project: projectId,
    user: loggedInUserId,
    role: ProjectRole.OWNER,
  });

  if (!ownerMembership) {
    throw new AppError("Only the project owner can remove members", 403);
  }

  // Exclude the owner from the delete list
  const filteredIds = validMemberIds.filter(
    (id) => id !== ownerMembership.user.toString(),
  );

  if (filteredIds.length === 0) {
    throw new AppError("Cannot remove the project owner", 400);
  }

  const result = await ProjectMember.deleteMany({
    project: projectId,
    user: { $in: filteredIds },
  });

  return res.status(200).json({
    message: "Members removed successfully",
    deletedCount: result.deletedCount,
  });
};

// ─── Get Project Members ──────────────────────────────────────────────────────

export const getProjectMembers = async (req: AuthRequest, res: Response) => {
  const loggedInUserId = req.user?.userId;
  const { projectId } = req.params;

  if (!loggedInUserId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project ID", 400);
  }

  const allMemberDetails = await ProjectMember.find({
    project: projectId,
  }).populate("user", "name email");

  return res.status(200).json({
    message: "Project members fetched successfully",
    allMemberDetails,
  });
};

