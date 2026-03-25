// `taskApi.ts`
import type { TaskValues } from "@/lib/schema/taskSchema";
import type { ApiResponse, ITask } from "@/lib/types";
import api from "./axiosClient";

export const createTaskApi = async (
  data: TaskValues,
): Promise<ApiResponse<ITask>> => {
  const response = await api.post("/tasks/create", data);
  return response.data;
};

export const getTasksApi = async (
  projectId: string,
): Promise<ApiResponse<ITask[]>> => {
  const response = await api.get("/tasks", {
    params: {
      projectId,
    },
  });

  return response.data;
};

export const updateTaskApi = async ({
  id,
  data,
}: {
  id: string;
  data: TaskValues;
}): Promise<ApiResponse<ITask>> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const bulkUpdateTasksApi = async (data: {
  id: string;
  updates?: TaskValues[];
  deletes?: string[];
}): Promise<ApiResponse<void>> => {
  const response = await api.patch("/tasks/bulk", data);
  return response.data;
};

export const deleteTaskApi = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
