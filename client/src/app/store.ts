import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/auth";
import authReducer from "../features/slice/authSlice";
import { postApi } from "../features/api/post";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, postApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
