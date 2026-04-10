import { AppError } from "../middlewares/errorHandler";
import { ProjectMember } from "../models/projectMember.model";

export const requireMembership = async (userId: string, projectId: string) => {
  const membership = await ProjectMember.findOne({
    user: userId,
    project: projectId,
  });
  if (!membership) {
    throw new AppError("You are not a member of this project.", 403);
  }
  return membership;
};
