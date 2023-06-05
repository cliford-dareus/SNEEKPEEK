import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";
import { IPost, IPostPayload } from "../../utils/types/types";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery,
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPost: builder.query({
      query: () => ({
        url: "/post",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.post.map(({ _id }: { _id: string }) => ({
                type: "Post" as const,
                _id,
              })),
            ]
          : ["Post"],
    }),
    post: builder.mutation<Partial<IPost>, IPostPayload>({
      query: (postPaylod) => ({
        url: "/post",
        method: "POST",
        body: postPaylod,
      }),
      invalidatesTags: ['Post']
    }),
  }),
});

export const { useGetPostQuery, usePostMutation } = postApi;
