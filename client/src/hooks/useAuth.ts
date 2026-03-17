import { useMutation, useQuery } from "@tanstack/react-query";
import { changePasswordApi, getMeApi } from "@/api/authApi";
import type { ChangePasswordValues } from "@/lib/schema/authSchema";

export const useGetMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
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
