import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../helpers/axiosApi";

const initialState = {
    user: null,
    updateObjInfo: { fullname: "", email: "", phone: "", address: "" },
    updateObjPass: { currentpass: "", newpass: "" },
    errors: {
        fullname: "",
        email: "",
        phone: "",
        address: "",
        currentpass: "",
        newpass: "",
    },
    orders: null,
    pending: false,
    error: null,
    isValid: false,
    updateInfoCompleted: false,
    updatePassCompleted: false,
};

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        handleOnChangeInfo: (state, action) => {
            const { field, value } = action.payload;
            state.updateObjInfo[field] = value;
            state.errors[field] = "";
        },
        handleOnChangePass: (state, action) => {
            const { field, value } = action.payload;
            state.updateObjPass[field] = value;
            state.errors[field] = "";
        },
        checkValidationInfo: (state) => {
            // check all field before submit
            Object.keys(state.updateObjInfo).forEach((field) => {
                state.errors[field] = String(state.updateObjInfo[field]).trim()
                    ? ""
                    : "This field is required";
            });
            // add errors
            const updateInfo = Object.keys(state.updateObjInfo);
            state.isValid = updateInfo.every((field) => !state.errors[field]);
        },
        checkValidationPass: (state) => {
            // check all field before submit
            Object.keys(state.updateObjPass).forEach((field) => {
                state.errors[field] = String(state.updateObjPass[field]).trim()
                    ? ""
                    : "This field is required";
            });
            // add errors
            const updateInfo = Object.keys(state.updateObjInfo);
            state.isValid = updateInfo.every((field) => !state.errors[field]);
        },

        clearState: (state) => {
            state.updateInfoCompleted = initialState.updateInfoCompleted;
            state.updatePassCompleted = initialState.updatePassCompleted;
            state.errors = initialState.errors;
            state.error = initialState.error;
            state.isValid = initialState.isValid;
        },
    },

    extraReducers: (builder) => {
        // fetch user by id
        builder.addCase(fetchProfile.fulfilled, (state, { payload }) => {
            state.user = payload.user;

            // Spread
            const { fullname, email, phone, address } = payload.user;
            state.updateObjInfo["fullname"] = fullname;
            state.updateObjInfo["email"] = email;
            state.updateObjInfo["phone"] = phone;
            state.updateObjInfo["address"] = address;
        });
        // update info
        builder.addCase(updateInfo.fulfilled, (state, { payload }) => {
            if (payload) {
                state.updateInfoCompleted = true;
                const { fullname, email, phone, address } = payload.user;
                state.updateObjInfo["fullname"] = fullname;
                state.updateObjInfo["email"] = email;
                state.updateObjInfo["phone"] = phone;
                state.updateObjInfo["address"] = address;
            }
        });
        builder.addCase(updateInfo.rejected, (state, { error }) => {
            state.error = error.message;
        });
        // update pass profile
        builder.addCase(updatePass.fulfilled, (state, { payload }) => {
            if (payload) {
                state.updatePassCompleted = true;
            }
        });
        builder.addCase(updatePass.rejected, (state, { error }) => {
            state.error = error.message;
        });
        // get orders by user id
        builder.addCase(fetchOrdersByUserId.fulfilled, (state, { payload }) => {
            state.orders = payload.orders;
        });
    },
});

// fetch profile user by id
export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (id) => {
        const response = await api.get("/user/profile/" + id);
        return response.data.metadata;
    }
);

// update info user by id
export const updateInfo = createAsyncThunk(
    "profile/updateInfo",
    async ({ id, fullname, email, phone, address }, { getState, dispatch }) => {
        dispatch(checkValidationInfo());
        const state = getState()["profile"];

        // if valid
        if (state.isValid) {
            const response = await api.put("/user/profile/" + id, {
                fullname,
                email,
                phone,
                address,
            });
            return response.data.metadata;
        }
        return null;
    }
);

// update info user by id
export const updatePass = createAsyncThunk(
    "profile/updatePass",
    async ({ id, currentpass, newpass }, { getState, dispatch }) => {
        dispatch(checkValidationInfo());
        const state = getState()["profile"];

        // if valid
        if (state.isValid) {
            const response = await api.patch("/user/profile/" + id, {
                currentpass,
                newpass,
            });
            return response.data;
        }
        return null;
    }
);

// get orders by user id
export const fetchOrdersByUserId = createAsyncThunk(
    "profile/fetchOrdersByUserId",
    async (id) => {
        const response = await api.get("/order/profile/" + id);
        return response.data.metadata;
    }
);

export const {
    handleOnChangeInfo,
    handleOnChangePass,
    checkValidationInfo,
    checkValidationPass,
    clearState,
} = profileSlice.actions;
