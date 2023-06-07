import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // getPost: builder.query({
    //   query: () => ({
    //     url: "/post",
    //     method: "GET",
    //   }),
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.post.map(({ _id }: { _id: string }) => ({
    //             type: "Post" as const,
    //             _id,
    //           })),
    //         ]
    //       : ["Post"],
    // }),
    getUserByUsername: builder.query({
      query: (username) => ({
        url: `/user/${username}`,
      }),
      providesTags: ["User"],
    }),
    followUser: builder.mutation({
      query: (payload) => ({
        url: `/user/follow/${payload.username}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useGetUserByUsernameQuery, useFollowUserMutation } = userApi;
