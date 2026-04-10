import { model, Schema } from "mongoose";
import { ISprint, SprintStatus } from "../lib/types";

const sprintSchema = new Schema<ISprint>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(SprintStatus),
    default: SprintStatus.PLANNED,
  },
  tasks: {
    type: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
});

sprintSchema.index({ projectId: 1 });

const Sprint = model<ISprint>("Sprint", sprintSchema);

export default Sprint;
