import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery,
  endpoints: (builder) => ({
    getPost: builder.query({
      query: () => ({
        url: "/post",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPostQuery } = postApi;
