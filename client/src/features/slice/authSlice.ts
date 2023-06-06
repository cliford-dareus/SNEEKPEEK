import { createSlice } from "@reduxjs/toolkit";
import { IAuthInitialState, IUserData } from "../../utils/types/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const initialState: IAuthInitialState = {
  user: { userId: "", username: "" },
  token: "",
  expiresAt: null
};

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { username, userId, accessToken, expiresAt } }: PayloadAction<IUserData>
    ) => {
      state.user = { userId, username };
      state.token = accessToken;
      state.expiresAt = expiresAt
      console.log(username)
    },
    removeCredentials: (state) => {
      state.user = { userId: "", username: ""};
      state.token = "";
      state.expiresAt = null;
    },
  },
});

export default authSlice.reducer;
export const { setCredentials, removeCredentials } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth;
