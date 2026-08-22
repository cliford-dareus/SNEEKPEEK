import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";
import { IPost, IPostPayload } from "../../utils/types/types";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPost: builder.query({
      query: () => ({
        url: "/post",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.post
          ? [
              ...result.post.map(({ _id }: { _id: string }) => ({
                type: "Post" as const,
                id: _id,
              })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    getUserPost: builder.query({
      query: (username: string) => ({
        url: `/post/personal/${username}`,
      }),
      providesTags: [{ type: "Post", id: "LIST" }],
    }),
    getTaggedPosts: builder.query({
      query: (username: string) => ({
        url: `/post/tagged/${username}`,
      }),
      providesTags: [{ type: "Post", id: "LIST" }],
    }),
    getTrendingPosts: builder.query({
      query: () => ({
        url: "/post/trending",
      }),
      providesTags: [{ type: "Post", id: "LIST" }],
    }),
    post: builder.mutation<Partial<IPost>, IPostPayload>({
      query: (postPayload) => ({
        url: "/post",
        method: "POST",
        body: postPayload,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: ({ postId, content, image, tags }) => ({
        url: `/post/edit`,
        method: "PATCH",
        body: { postId, content, image, tags },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    deletePost: builder.mutation({
      query: (postId: string) => ({
        url: `/post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    likeOrUnlikePost: builder.mutation({
      query: (postId: string) => ({
        url: `/post/${postId}`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPostQuery,
  useGetUserPostQuery,
  useGetTaggedPostsQuery,
  useGetTrendingPostsQuery,
  usePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikeOrUnlikePostMutation,
} = postApi;
