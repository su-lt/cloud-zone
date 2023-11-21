import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
};
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload;
        },
        logout: (state, action) => {
            state.username = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.username = action.payload;
        },
        clearState: (state) => {
            state = initialState;
        },
    },
});
