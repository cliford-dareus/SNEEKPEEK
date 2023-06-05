import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { RootState } from "../../app/store";
import { baseUrl } from "../../utils/proxy";


export const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});