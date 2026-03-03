import { model, Schema } from "mongoose";
import { IProjectMember, ProjectRole } from "../lib/types";

const projectMemberSchema = new Schema<IProjectMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ProjectRole),
      default: ProjectRole.MEMBER,
    },
  },
  { timestamps: true },
);
projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });
export const ProjectMember = model<IProjectMember>(
  "ProjectMember",
  projectMemberSchema,
);
