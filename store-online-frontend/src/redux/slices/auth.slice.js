import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../helpers/axiosApi";

const initialState = {
    fullname: "",
    isLogin: false,
    isAdmin: false,
    loginObject: {
        email: "",
        password: "",
    },
    errors: {
        email: "",
        password: "",
    },
    completed: false,
    pending: false,
    error: null,
    isValid: false,
};
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        handleOnChange: (state, action) => {
            const { field, value } = action.payload;
            state.loginObject[field] = value;
            state.errors[field] = "";
        },
        checkValidation: (state) => {
            // check all field before submit
            Object.keys(state.loginObject).forEach((field) => {
                state.errors[field] = String(state.loginObject[field]).trim()
                    ? ""
                    : "This field is required";
            });
            // add errors
            state.isValid = Object.values(state.errors).every(
                (error) => !error
            );
        },
        setCurrentUser: (state, action) => {
            state.fullname = action.payload;
        },
        clearState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(login.fulfilled, (state, { payload }) => {
            if (payload) {
                const { username, isAdmin, id, accessToken } = payload;
                state.isLogin = true;
                state.fullname = username;
                state.isAdmin = isAdmin;
                state.completed = true;

                // set local storage
                localStorage.setItem("id", id);
                localStorage.setItem("accessToken", accessToken);
            }
        });
        builder.addCase(login.rejected, (state, action) => {
            // console.log(action);
            state.error = "Login failed, please try again !";
        });
        // logout
        builder.addCase(logout.fulfilled, (state) => {
            localStorage.removeItem("id");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("cart");
        });
        // check authentication
        builder.addCase(checkAuth.fulfilled, (state, { payload }) => {
            if (payload) {
                const { username, isAdmin } = payload;
                state.isLogin = true;
                state.fullname = username;
                state.isAdmin = isAdmin;
            }
        });
    },
});

// login
export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { getState, dispatch }) => {
        dispatch(checkValidation());
        const state = getState()["auth"];

        if (state.isValid) {
            const response = await api.post("/access/login", {
                email,
                password,
            });
            return response.data.metadata;
        }
        return null;
    }
);

// logout
export const logout = createAsyncThunk("auth/logout", async () => {
    const response = await api.get("/access/logout");
    return response.data;
});

// check authentication
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
    const response = await api.get("/access/checkAuth");
    return response.data.metadata;
});

export const { handleOnChange, checkValidation, clearState } =
    authSlice.actions;
