import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../helpers/axiosApi";

const initialState = {
    id: "",
    fullname: "",
    isLogin: false,
    isAdmin: false,
    isDarkMode: false,
    loginObject: {
        email: "",
        password: "",
    },
    registerObject: {
        fullname: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        repass: "",
    },
    errors: {
        fullname: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        repass: "",
    },
    lastPage: "",
    completed: false,
    resetCompleted: false,
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
        handleOnChangeRegister: (state, action) => {
            const { field, value } = action.payload;
            state.registerObject[field] = value;
            state.errors[field] = "";
        },
        checkValidation: (state) => {
            // check all field before submit
            Object.keys(state.loginObject).forEach((field) => {
                state.errors[field] = String(state.loginObject[field]).trim()
                    ? ""
                    : "This field is required";
            });
            // check email
            if (
                state.loginObject["email"] &&
                !validateEmail(state.loginObject["email"])
            ) {
                state.errors["email"] = "Invalid email";
            }
            // add errors
            state.isValid = Object.values(state.errors).every(
                (error) => !error
            );
        },
        checkValidationSignUp: (state) => {
            // check empty
            Object.keys(state.registerObject).forEach((field) => {
                state.errors[field] = String(state.registerObject[field]).trim()
                    ? ""
                    : "This field is required";
            });
            // match password
            if (
                state.registerObject["password"] !==
                state.registerObject["repass"]
            ) {
                state.errors["repass"] = "Password not match";
            }
            // check phone number
            if (
                state.registerObject["phone"] &&
                !validatePhone(state.registerObject["phone"])
            ) {
                state.errors["phone"] = "Invalid phone number";
            }
            // check email
            if (
                state.registerObject["email"] &&
                !validateEmail(state.registerObject["email"])
            ) {
                state.errors["email"] = "Invalid email";
            }
            // add errors
            const regObjectFields = Object.keys(state.registerObject);
            state.isValid = regObjectFields.every(
                (field) => !state.errors[field]
            );
        },
        setCurrentUser: (state, action) => {
            state.fullname = action.payload;
        },
        setLastPage: (state, action) => {
            state.lastPage = action.payload;
        },
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
            // toggle dark mode to body class
            document.body.classList.toggle("dark", state.isDarkMode);
            localStorage.setItem("darkMode", state.isDarkMode);
        },
        clearObjectState: (state) => {
            state.loginObject = initialState.loginObject;
            state.registerObject = initialState.registerObject;
            state.completed = initialState.completed;
            state.resetCompleted = initialState.resetCompleted;
            state.errors = initialState.errors;
            state.error = initialState.error;
            state.isValid = initialState.isValid;
        },
        clearAuthState: (state) => {
            return {
                ...initialState,
                isDarkMode: state.isDarkMode,
            };
        },
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(login.fulfilled, (state, { payload }) => {
            if (payload) {
                const { id, username, isAdmin, accessToken } = payload;
                state.id = id;
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
            state.error = "Login failed, please try again !";
        });
        // signup
        builder.addCase(signup.fulfilled, (state, { payload }) => {
            if (payload) {
                const { id, username, isAdmin, accessToken } = payload;
                state.id = id;
                state.isLogin = true;
                state.fullname = username;
                state.isAdmin = isAdmin;
                state.completed = true;

                // set local storage
                localStorage.setItem("id", id);
                localStorage.setItem("accessToken", accessToken);
            }
        });
        builder.addCase(signup.rejected, (state, action) => {
            state.error = "Sign up failed, please try again !";
        });
        // logout
        builder.addCase(logout.fulfilled, (state) => {
            localStorage.removeItem("id");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("cart");
        });
        // forgotPassword
        builder.addCase(forgotPassword.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.completed = true;
            state.error = null;
        });
        builder.addCase(forgotPassword.pending, (state, { error }) => {
            state.pending = true;
        });
        builder.addCase(forgotPassword.rejected, (state, { error }) => {
            state.pending = false;
            state.error = "Reset failed, please try again !!!";
        });
        // resetPassword
        builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
            state.resetCompleted = true;
            state.error = null;
        });
        builder.addCase(resetPassword.rejected, (state, { error }) => {
            state.error = "Reset failed, please try again !!!";
        });
        // check authentication
        builder.addCase(checkAuth.fulfilled, (state, { payload }) => {
            if (payload) {
                const { id, username, isAdmin } = payload;
                state.id = id;
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

// signup
export const signup = createAsyncThunk(
    "auth/signup",
    async (
        { fullname, email, phone, address, password },
        { getState, dispatch }
    ) => {
        dispatch(checkValidationSignUp());
        const state = getState()["auth"];

        if (state.isValid) {
            const response = await api.post("/access/signup", {
                fullname,
                email,
                phone,
                address,
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

// forgot password
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email) => {
        const response = await api.post("/access/forgot", { email });
        return response.data;
    }
);

// reset password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ id, password, token }) => {
        const response = await api.post("/access/reset/" + id, {
            password,
            token,
        });
        return response.data;
    }
);

// check authentication
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
    const response = await api.get("/access/checkAuth");
    return response.data.metadata;
});

// check phone number
const validatePhone = (paramPhone) => {
    var vValidRegex = /((0|\+)+([0-9]{9,11})\b)/g;
    if (paramPhone.match(vValidRegex)) {
        return true;
    } else {
        return false;
    }
};

// check email
const validateEmail = (paramEmail) => {
    var vValidRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (paramEmail.match(vValidRegex)) {
        return true;
    } else {
        return false;
    }
};

export const {
    handleOnChange,
    handleOnChangeRegister,
    checkValidation,
    checkValidationSignUp,
    setLastPage,
    toggleDarkMode,
    clearObjectState,
    clearAuthState,
} = authSlice.actions;
