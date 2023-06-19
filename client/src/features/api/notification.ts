import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "../../utils/Private/PrivateQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery,
  tagTypes: ["Notification"],
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
    getNotifications: builder.query({
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
