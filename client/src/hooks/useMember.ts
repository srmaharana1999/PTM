import {
  addMembersApi,
  deleteMembersApi,
  getProjectMembersApi,
  updateMemberRoleApi,
} from "@/api/memberApi";
import { queryClient } from "@/lib/queryClient";
import type { ProjectRole } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetProjectMembers = (projectId: string) =>
  useQuery({
    queryKey: ["members", projectId],
    queryFn: () => getProjectMembersApi(projectId),
    staleTime: 1000 * 60 * 15,
    enabled: !!projectId,
  });

export const useAddMembers = (projectId: string) =>
  useMutation({
    mutationFn: (
      members: Array<{
        userId: string;
        role: ProjectRole;
      }>
    ) => addMembersApi({ projectId, members }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
    },
  });

export const useUpdateMemberRole = (projectId: string) =>
  useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: ProjectRole;
    }) => updateMemberRoleApi({ projectId, memberId, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
    },
  });

export const useDeleteMembers = (projectId: string) =>
  useMutation({
    mutationFn: (members: string[]) => deleteMembersApi({ projectId, members }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
    },
  });
