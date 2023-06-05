import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ILoginPayload,
  IRefreshTokenResponse,
  IRegisterPayload,
  IUserDataResponse,
} from "../../utils/types/types";
import { baseQuery } from "../../utils/Private/PrivateQuery";



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
