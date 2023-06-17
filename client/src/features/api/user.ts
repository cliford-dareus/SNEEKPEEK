import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";
import { IFullUserResponse } from "../../utils/types/types";

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
    getUserByUsername: builder.query<IFullUserResponse, string | undefined>({
      query: (username) => ({
        url: `/user/${username}`,
      }),
      providesTags: ["User"],
    }),
    followUser: builder.mutation({
      query: (payload) => ({
        url: `/user/follow/${payload.username}`,
        method: 'POST'
      }),
      invalidatesTags: ['User']
    }),
    acceptRequest: builder.mutation({
      query: (userId) => ({
        url: `/user/accept-request/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    searchUser: builder.query({
      query: (payload) => ({
        url: `/user?username=${payload.searchTerm}`,
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/user/single/${id}`,
      }),
    }),
  }),
});

export const {
  useGetUserByUsernameQuery,
  useFollowUserMutation,
  useAcceptRequestMutation,
  useSearchUserQuery,
  useGetUserByIdQuery,
} = userApi;
