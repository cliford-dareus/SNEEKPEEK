import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery,
  tagTypes: ['Comment', 'Post'],
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
    getPostWithComment: builder.query({
      query: (postId) => ({
        url: `/post/${postId}`,
      }),
      providesTags: ['Comment']
    }),
    postComment: builder.mutation({
      query: (postPayload) => ({
        url: '/comment',
        method: 'POST',
        body: postPayload
      }),
      invalidatesTags: ['Comment', 'Post']
    })
  }),
});

export const { useGetPostWithCommentQuery, usePostCommentMutation } = commentApi;
