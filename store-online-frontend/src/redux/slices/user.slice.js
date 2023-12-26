import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    users: [],
    roles: [],
    totalCustomers: 0,
    defaultAddress: "",
    user: null,
    userObject: { fullname: "", password: "", email: "", address: "" },
    errors: { fullname: "", password: "", email: "", address: "" },
    updateObject: { id: "", role: "", status: "" },
    deleteObject: { id: "", email: "" },
    totalPages: 0,
    pending: false,
    error: null,
    isValid: false,
    createCompleted: false,
    updateCompleted: false,
    deleteCompleted: false,
};
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        handleOnChange: (state, action) => {
            const { field, value } = action.payload;
            state.userObject[field] = value;
            state.errors[field] = "";
        },
        handleOnChangeUpdate: (state, action) => {
            const { field, value } = action.payload;
            state.updateObject[field] = value;
            state.errors[field] = "";
        },
        setUserUpdate: (state, action) => {
            state.user = action.payload;
            state.updateObject.id = action.payload._id;
            state.updateObject.role = action.payload.role._id;
            state.updateObject.status = action.payload.status;
        },
        setDeleteOject: (state, action) => {
            state.deleteObject.id = action.payload._id;
            state.deleteObject.email = action.payload.email;
        },
        setCreateCompleted: (state) => {
            state.createCompleted = initialState.createCompleted;
        },
        setUpdateCompleted: (state) => {
            state.updateCompleted = initialState.updateCompleted;
        },
        setDeleteCompleted: (state) => {
            state.deleteCompleted = initialState.deleteCompleted;
        },
        setError: (state) => {
            state.error = initialState.error;
        },
        checkValidation: (state) => {
            Object.keys(state.userObject).forEach((field) => {
                state.errors[field] = String(state.userObject[field]).trim()
                    ? ""
                    : "This field is required";
            });
            state.isValid = Object.values(state.errors).every(
                (error) => !error
            );
        },
        clearState: (state) => {
            state.userObject = initialState.userObject;
            state.user = initialState.user;
            state.errors = initialState.errors;
        },
    },
    extraReducers: (builder) => {
        // fetch users
        builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.users = payload.users;
            state.totalPages = Math.ceil(
                payload.totalUsers / process.env.REACT_APP_PRODUCT_LIMIT
            );
        });
        builder.addCase(fetchUsers.rejected, (state, { error }) => {
            state.pending = false;
            // state.error = error.message;
        });
        builder.addCase(fetchUsers.pending, (state) => {
            state.pending = true;
        });
        // create user
        builder.addCase(createUser.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                state.createCompleted = true;
            }
        });
        builder.addCase(createUser.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(createUser.pending, (state) => {
            state.pending = true;
        });
        // update user
        builder.addCase(updateUser.fulfilled, (state) => {
            state.updateCompleted = true;
        });
        builder.addCase(updateUser.rejected, (state, { error }) => {
            state.error = error.message;
        });
        builder.addCase(deleteUser.fulfilled, (state) => {
            state.deleteCompleted = true;
        });
        builder.addCase(deleteUser.rejected, (state, { error }) => {
            state.error = error.message;
        });
        // fetch roles
        builder.addCase(fetchRoles.fulfilled, (state, { payload }) => {
            state.roles = payload.roles;
        });
        // get total customers
        builder.addCase(fetchTotalCustomers.fulfilled, (state, { payload }) => {
            state.totalCustomers = payload.count;
        });
        // fetch user address
        builder.addCase(fetchUserAddress.fulfilled, (state, { payload }) => {
            state.defaultAddress = payload.address;
        });
    },
});

// get users
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({ searchString, page }) => {
        const query = buildQueryString({
            searchString,
            page,
        });
        const response = await api.get("/user?" + query);
        return response.data.metadata;
    }
);

// get roles
export const fetchRoles = createAsyncThunk("users/fetchRoles", async () => {
    const response = await api.get("/user/roles");
    return response.data.metadata;
});

// create user
export const createUser = createAsyncThunk(
    "users/createUser",
    async (_, { getState, dispatch }) => {
        dispatch(checkValidation());
        const state = getState()["user"];

        if (state.isValid) {
            const response = await api.post("/user/", {
                fullname: state.userObject.fullname,
                password: state.userObject.password,
                email: state.userObject.email,
                address: state.userObject.address,
            });
            return response.data.metadata;
        }
        return null;
    }
);

// update user
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (_, { getState }) => {
        const user = getState()["user"];

        const response = await api.post("/user/" + user.updateObject.id, {
            role: user.updateObject.role,
            status: user.updateObject.status,
        });
        return response.data.metadata;
    }
);

// delete user
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
    const response = await api.delete("/user/" + id);
    return response.data.metadata;
});

// fetch total customers
export const fetchTotalCustomers = createAsyncThunk(
    "users/fetchTotalCustomers",
    async () => {
        const response = await api.get("/user/totalCustomer");
        return response.data.metadata;
    }
);

// fetch user address
export const fetchUserAddress = createAsyncThunk(
    "users/fetchUserAddress",
    async (id) => {
        const response = await api.get("/user/address/" + id);
        return response.data.metadata;
    }
);

export const {
    handleOnChange,
    handleOnChangeUpdate,
    setUserUpdate,
    setDeleteOject,
    checkValidation,
    setCreateCompleted,
    setUpdateCompleted,
    setDeleteCompleted,
    setError,
    clearState,
} = userSlice.actions;
