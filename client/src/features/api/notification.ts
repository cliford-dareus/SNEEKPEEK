import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: `/notification`,
      }),
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation({
      query: (id: string) => ({
        url: `/notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: `/notification/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
