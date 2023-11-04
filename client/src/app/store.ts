import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/slice/authSlice";

import { authApi } from "../features/api/auth";
import { postApi } from "../features/api/post";
import { commentApi } from "../features/api/comment";
import { userApi } from "../features/api/user";
import { conversationApi } from "../features/api/conversations";
import { messageApi } from "../features/api/message";
import { notificationApi } from "../features/api/notification";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [conversationApi.reducerPath]: conversationApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postApi.middleware,
      commentApi.middleware,
      userApi.middleware,
      conversationApi.middleware,
      messageApi.middleware,
      notificationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
