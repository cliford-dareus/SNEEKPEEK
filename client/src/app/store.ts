import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/auth";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch