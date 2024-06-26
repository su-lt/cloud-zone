import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    users: [],
    roles: [],
    totalCustomers: 0,
    defaultAddress: "",
    user: null,
    userObject: {
        fullname: "",
        password: "",
        email: "",
        phone: "",
        address: "",
    },
    errors: { fullname: "", password: "", email: "", phone: "", address: "" },
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
            switch (payload.status) {
                case "success":
                    const { users, totalUsers } = payload.metadata;
                    state.users = users;
                    state.totalPages = Math.ceil(
                        totalUsers / process.env.REACT_APP_PRODUCT_LIMIT
                    );
                    break;

                default:
                    break;
            }
        });
        builder.addCase(fetchUsers.pending, (state) => {
            state.pending = true;
        });
        // create user
        builder.addCase(createUser.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                switch (payload.status) {
                    case "success":
                        state.createCompleted = true;
                        break;

                    default:
                        state.error = payload.message;
                        break;
                }
            }
        });
        builder.addCase(createUser.pending, (state) => {
            state.pending = true;
        });
        // create user by admin
        builder.addCase(createUserByAdmin.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                switch (payload.status) {
                    case "success":
                        const { user } = payload.metadata;
                        state.createCompleted = true;
                        state.user = user;
                        state.userObject = initialState.userObject;
                        break;

                    default:
                        state.error = payload.message;
                        break;
                }
            }
        });
        builder.addCase(createUserByAdmin.pending, (state) => {
            state.pending = true;
        });
        // update user
        builder.addCase(updateUser.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.updateCompleted = true;
                    break;

                default:
                    state.error = payload.message;
                    break;
            }
        });
        // delete user
        builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.deleteCompleted = true;
                    break;

                default:
                    state.error = payload.message;
                    break;
            }
        });
        // fetch roles
        builder.addCase(fetchRoles.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.roles = payload.metadata.roles;
                    break;

                default:
                    break;
            }
        });
        // get total customers
        builder.addCase(fetchTotalCustomers.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.totalCustomers = payload.metadata.count;
                    break;

                default:
                    break;
            }
        });
        // fetch user address
        builder.addCase(fetchUserAddress.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.defaultAddress = payload.metadata.address;
                    break;

                default:
                    break;
            }
        });
        // find customers
        builder.addCase(findCustomer.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { users } = payload.metadata;
                    state.users = users;
                    break;

                default:
                    break;
            }
        });
    },
});

// get users
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({
        searchString,
        page,
        limit = process.env.REACT_APP_PRODUCT_LIMIT,
    }) => {
        const query = buildQueryString({
            searchString,
            page,
            limit,
        });
        const response = await api.get("/user?" + query);
        return response.data;
    }
);

// get roles
export const fetchRoles = createAsyncThunk("users/fetchRoles", async () => {
    const response = await api.get("/user/roles");
    return response.data;
});

// user create new customer
export const createUser = createAsyncThunk(
    "users/createUser",
    async (_, { getState, dispatch }) => {
        dispatch(checkValidation());
        const state = getState()["user"];

        if (state.isValid) {
            const response = await api.post("/user/", {
                fullname: state.userObject.fullname,
                password: state.userObject.password,
                phone: state.userObject.phone,
                email: state.userObject.email,
                address: state.userObject.address,
            });
            return response.data;
        }
    }
);

// admin create new customer
export const createUserByAdmin = createAsyncThunk(
    "users/createUserByAdmin",
    async ({ fullname, email, phone, address }) => {
        const response = await api.post("/user/", {
            fullname,
            email,
            phone,
            address,
            password: Math.floor(100000 + Math.random() * 900000).toString(),
            status: "inactive",
        });
        return response.data;
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
        return response.data;
    }
);

// delete user
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
    const response = await api.delete("/user/" + id);
    return response.data;
});

// fetch total customers
export const fetchTotalCustomers = createAsyncThunk(
    "users/fetchTotalCustomers",
    async () => {
        const response = await api.get("/user/totalCustomer");
        return response.data;
    }
);

// fetch user address
export const fetchUserAddress = createAsyncThunk(
    "users/fetchUserAddress",
    async (id) => {
        const response = await api.get("/user/address/" + id);
        return response.data;
    }
);

// find customer by name/phone
export const findCustomer = createAsyncThunk(
    "users/findCustomer",
    async (searchCustomer) => {
        const search = searchCustomer ? searchCustomer : "notsearch";
        const response = await api.get("/user/findCustomer/" + search);
        return response.data;
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
