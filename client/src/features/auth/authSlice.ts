import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.loading = false;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setCredentials, setAccessToken, logout, stopLoading } =
  authSlice.actions;

export default authSlice.reducer;
