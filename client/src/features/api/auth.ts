import { baseUrl } from "../../utils/proxy";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ILoginPayload,
  IRefreshTokenResponse,
  IRegisterPayload,
  IUserDataResponse,
} from "../../utils/types/types";
import { RootState } from "../../app/store";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    signUpUser: builder.mutation<unknown, IRegisterPayload>({
      query: (userPayload) => ({
        url: "/auth/signup",
        method: "POST",
        body: userPayload,
      }),
    }),
    signInUser: builder.mutation<IUserDataResponse, ILoginPayload>({
      query: (signInPayload) => ({
        url: "/auth/signin",
        method: "POST",
        body: signInPayload,
      }),
    }),
    signOutUser: builder.mutation({
      query: () => ({
        url: "/auth/signout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation<IRefreshTokenResponse, any>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignUpUserMutation,
  useSignInUserMutation,
  useSignOutUserMutation,
  useRefreshTokenMutation
} = authApi;
