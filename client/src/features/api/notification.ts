import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query<any, void>({
      query: () => ({
        url: `/notification`,
      }),
      providesTags: ["Notification"],
    }),
    updateNotification: builder.mutation({
      query: () => ({
        url: "",
        method: "PATCH",
      }),
    }),
  }),
});

export const { useGetNotificationsQuery, useUpdateNotificationMutation } =
  notificationApi;
