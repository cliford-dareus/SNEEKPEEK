import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/proxy";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {},
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    signUpUser: builder.mutation({
      query: (userPayload) => ({
        url: "/auth/signup",
        method: "POST",
        body: userPayload,
      }),
    }),
  }),
});

export const { useSignUpUserMutation } = authApi;
