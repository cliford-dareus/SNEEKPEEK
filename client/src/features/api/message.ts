import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery,
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) => ({
        url: `/message/${id}`,
        method: "GET",
      }),
      providesTags: ["Message"],
    }),
    addNewMessage: builder.mutation({
      query: (payload) => ({
        url: `/message/${payload.conversationId}`,
        method: "POST",
        body: payload.msg,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useAddNewMessageMutation, useGetMessagesQuery } =
  messageApi;
