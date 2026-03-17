import * as Yup from "yup";
import { ProjectStatus } from "../types";

export const initialValues = {
  title: "",
  description: "",
  members: [],
  status: "",
};

export const projectSchema = Yup.object({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  members:Yup.array().of(Yup.string()).min(1, "At least one member required").required("Required"),
  status: Yup.mixed<ProjectStatus>().oneOf(Object.values(ProjectStatus)).required("Required"),
})

export const createProjectSchema = projectSchema;
export const editProjectSchema = projectSchema;

export type ProjectValues = Yup.InferType<typeof projectSchema>;