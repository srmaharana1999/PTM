import type { ApiResponse, IProjectMember, ProjectRole } from "@/lib/types";
import api from "./axiosClient";

export const getProjectMembersApi = async (
  projectId: string,
): Promise<ApiResponse<IProjectMember[]>> => {
  const response = await api.get(`/membership/project/${projectId}`);
  console.log(response.data);
  return response.data;
};

export interface AddMemberPayload {
  projectId: string;
  members: Array<{
    userId: string;
    role: ProjectRole;
  }>;
}

export const addMembersApi = async (
  data: AddMemberPayload,
): Promise<ApiResponse<IProjectMember[]>> => {
  const response = await api.post("/membership", data);
  return response.data;
};

export const updateMemberRoleApi = async ({
  projectId,
  memberId,
  role,
}: {
  projectId: string;
  memberId: string;
  role: string;
}): Promise<ApiResponse<IProjectMember>> => {
  const response = await api.patch(
    `/membership/project/${projectId}/member/${memberId}`,
    { role },
  );
  return response.data;
};

export const deleteMembersApi = async (data: {
  projectId: string;
  members: string[]; // array of user IDs to remove
}): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/membership/project/${data.projectId}`, {
    data: { members: data.members },
  });
  return response.data;
};
