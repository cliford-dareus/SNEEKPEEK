import { createSlice } from "@reduxjs/toolkit";
import { IAuthInitialState } from "../../utils/types/types";

const initialState: IAuthInitialState = {
    user: [],
    token: ''
}

export const authSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {}
})