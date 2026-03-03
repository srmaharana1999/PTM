import { model, Schema } from "mongoose";
import { ITask, TaskPriority, TaskStatus } from "../lib/types";

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

taskSchema.index({ projectId: 1 });
taskSchema.index({ assigneeId: 1 });
taskSchema.index({ projectId: 1, status: 1 }); 

const Task = model<ITask>("Task", taskSchema);

export default Task;
