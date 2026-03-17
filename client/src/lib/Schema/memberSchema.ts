import * as Yup from "yup";
import { ProjectRole } from "../types";

export const initialValues = {
    project:"",
    assignee:"",
    role:""
}

export const memberSchema = Yup.object({
    project:Yup.string().required('Required'),
    assignee:Yup.string().required("Required"),
    role:Yup.mixed<ProjectRole>().oneOf(Object.values(ProjectRole)).required('Required')
})

export const addMemberSchema = memberSchema;

export type MemberValues = Yup.InferType<typeof memberSchema>;