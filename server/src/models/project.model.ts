import { model, Schema } from "mongoose";
import { IProject, ProjectStatus } from "../lib/types";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ACTIVE,
    },
  },
  { timestamps: true },
);

export const Project = model<IProject>("Project", projectSchema);
