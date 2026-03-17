// `authApi.ts`
//   - `loginApi({ email, password })`
//   - `registerApi({ name, email, password })`
//   - `logoutApi()`
//   - `getMeApi()`
//   - `refreshTokenApi()`
//   - `changePasswordApi({ currPassword, newPassword })`

import type {
  ChangePasswordValues,
  LoginValues,
  RegisterValues,
} from "@/lib/schema/authSchema";
import type { ApiResponse, User } from "@/lib/types";
import api from "./axiosClient";

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const loginApi = async (
  data: LoginValues,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerApi = async (
  data: RegisterValues,
): Promise<ApiResponse<void>> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse<void>> => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getMeApi = async (): Promise<ApiResponse<User>> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const refreshTokenApi = async (): Promise<
  ApiResponse<{ accessToken: string }>
> => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const changePasswordApi = async (
  data: ChangePasswordValues,
): Promise<ApiResponse<void>> => {
  // console.log(data);
  const response = await api.patch("/auth/change-password", data);
  return response.data;
};
