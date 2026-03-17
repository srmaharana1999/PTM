

import {
  bulkUpdateTasksApi,
  createTaskApi,
  deleteTaskApi,
  getTasksApi,
  updateTaskApi,
} from "@/api/taskApi";
import { queryClient } from "@/lib/queryClient";
import type { TaskValues } from "@/lib/schema/taskSchema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetTasks = (projectId: string) =>
  useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksApi(projectId),
    staleTime: 1000 * 60 * 15,
    enabled: !!projectId,
  });

export const useCreateTask = () =>
  useMutation({
    mutationFn: (data: TaskValues) => createTaskApi(data),
    onSuccess: (_,data) => {
      console.log("Task Created SuccessFully");
      queryClient.invalidateQueries({ queryKey: ["tasks",data.project] });
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });

export const useUpdateTask = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskValues }) =>
      updateTaskApi({ id, data }),
    onSuccess: (_, { data }) => {
      console.log("Task Updated SuccessFully");
      queryClient.invalidateQueries({ queryKey: ["tasks", data.project] });
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

export const useDeleteTask = () =>
  useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) => deleteTaskApi(id),
    onSuccess: (_, { projectId }) => {
      console.log("Task Deleted SuccessFully");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
    onError: (error) => {
      console.error("Task deletion failed:", error);
    },
  });

export const useBulkUpdateTasks = () =>
  useMutation({
    mutationFn: ({
      id,
      updates,
      deletes,
    }: {
      id: string;
      updates: TaskValues[];
      deletes: string[];
    }) => bulkUpdateTasksApi({ id, updates, deletes }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });
