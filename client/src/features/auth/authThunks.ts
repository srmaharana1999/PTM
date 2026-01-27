import api from "../../api/axiosClient";
import type { AppDispatch } from "../../app/store";
import { logout, setCredentials, stopLoading } from "./authSlice";

export const loginUser =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      dispatch(setCredentials(res.data));
    } catch (error: any) {
      console.log("error", error);
      // Re-throw the error so it can be caught in the component
      throw error;
    }
  };

export const registerUser =
  ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) =>
  async () => {
    try {
      await api.post("/auth/register", { name, email, password });
    } catch (error: any) {
      console.log("Register error", error);
      throw error;
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  await api.post("/auth/logout");
  dispatch(logout());
};

export const initAuth = () => async (dispatch: AppDispatch) => {
  try {
    const res = await api.post("/auth/refresh");
    dispatch(setCredentials(res.data));
  } catch {
    dispatch(logout());
  } finally {
    dispatch(stopLoading());
  }
};
