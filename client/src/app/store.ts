import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/slice/authSlice";
import messageReducer from '../features/slice/messageSlice';

import { authApi } from "../features/api/auth";
import { postApi } from "../features/api/post";
import { commentApi } from "../features/api/comment";
import { userApi } from "../features/api/user";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authReducer,
    messages: messageReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postApi.middleware,
      commentApi.middleware,
      userApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
