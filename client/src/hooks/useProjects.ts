import {
  createProjectApi,
  deleteProjectApi,
  getProjectByIdApi,
  getProjectsApi,
  updateProjectApi,
} from "@/api/projectApi";
import { queryClient } from "@/lib/queryClient";
import type { ProjectValues } from "@/lib/schema/projectSchema.ts";
import type { IUpdateProjectValue } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsApi,
    staleTime: 1000 * 60 * 5,
  });

export const useGetProjectById = (id: string) =>
  useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectByIdApi(id),
    staleTime: 1000 * 60 * 15,
    enabled: !!id,
  });

export const useCreateProject = () =>
  useMutation({
    mutationFn: (data: ProjectValues) => createProjectApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

export const useUpdateProject = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateProjectValue }) =>
      updateProjectApi({ data, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });

export const useDeleteProject = () =>
  useMutation({
    mutationFn: (id: string) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
