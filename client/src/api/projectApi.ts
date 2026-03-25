// `projectApi.ts`
//   - `getProjectsApi()`
//   - `getProjectByIdApi(projectId)`
//   - `createProjectApi(data)`
//   - `updateProjectApi(projectId, data)`
//   - `deleteProjectApi(projectId)`

import type { ProjectValues } from "@/lib/schema/projectSchema.ts";
import type { ApiResponse, IProject, IUpdateProjectValue } from "@/lib/types";
import api from "./axiosClient";

export const getProjectsApi = async (): Promise<ApiResponse<IProject[]>> => {
  const response = await api.get("/projects/");
  return response.data;
};

export const getProjectByIdApi = async (
  id: string,
): Promise<ApiResponse<IProject>> => {
  const response = await api.get(`/projects/${id}`);
  // console.log(response.data);
  return response.data;
};

export const createProjectApi = async (
  data: ProjectValues,
): Promise<ApiResponse<IProject>> => {
  const response = await api.post("/projects/create", data);
  return response.data;
};

export const updateProjectApi = async ({
  data,
  id,
}: {
  data: IUpdateProjectValue;
  id: string;
}): Promise<ApiResponse<IProject>> => {
  const response = await api.patch(`/projects/${id}`, data);
  return response.data;
};

export const deleteProjectApi = async (
  id: string,
): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};
