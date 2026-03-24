import * as Yup from "yup";
import { TaskPriority, TaskStatus } from "../types";

export const taskSchema = Yup.object({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  priority: Yup.mixed<TaskPriority>()
    .oneOf(Object.values(TaskPriority))
    .required("Required"),
  status: Yup.mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus))
    .required("Required"),
  dueDate: Yup.string().required("Required"),
  assigneeId: Yup.string().required("Required"),
  projectId: Yup.string().required("Required"),
});

export type TaskValues = Yup.InferType<typeof taskSchema>;

export const initialValues: TaskValues = {
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM,
  status: TaskStatus.TODO,
  dueDate: "",
  assigneeId: "",
  projectId: "",
};

export const createTaskSchema = taskSchema;
export const editTaskSchema = taskSchema;

