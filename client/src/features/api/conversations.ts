import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery,
  tagTypes: ["Conversation"],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: "/conversation",
        method: "GET",
      }),
      providesTags: ["Conversation"],
    }),
    createConversation: builder.mutation({
      query: (payload) => ({
        url: "/conversation",
        method: "POST",
        body: { recieverId: payload },
      }),
      invalidatesTags: ["Conversation"],
    }),
  }),
});

export const { useGetConversationsQuery, useCreateConversationMutation } =
  conversationApi;
