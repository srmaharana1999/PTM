import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changePasswordApi,
  getMeApi,
  getUsersApi,
  searchUsersApi,
} from "@/api/authApi";
import type { ChangePasswordValues } from "@/lib/schema/authSchema";

export const useGetMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    staleTime: 1000 * 60 * 5,
  });

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsersApi,
    staleTime: 1000 * 60 * 5,
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: ChangePasswordValues) => changePasswordApi(data), // ← calls PATCH /auth/change-password
    onSuccess: () => {
      console.log("passwords changed successfully");
    },
    onError: (error) => {
      console.error("Change password failed:", error);
    },
  });

export const useSearchUsers = (query: string) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => searchUsersApi(query),
    staleTime: 1000 * 60 * 5,
  });
