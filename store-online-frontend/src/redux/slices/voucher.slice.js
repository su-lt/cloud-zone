import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    vouchers: [],
    createObject: {
        discount: "none",
    },
    updateObject: {
        id: "",
        code: "",
        status: "",
    },
    deleteObject: {
        id: "",
        code: "",
    },
    errors: {
        discount: "",
    },
    createCompleted: false,
    updateCompleted: false,
    deleteCompleted: false,
    pending: false,
    error: null,
    isValid: false,
    totalPages: 0,
};

export const voucherSlice = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        handleOnChange: (state, action) => {
            state.createObject["discount"] = action.payload;
            state.errors["discount"] = "";
        },
        handleUpdateOnChange: (state, action) => {
            state.updateObject["status"] = action.payload;
            state.errors["status"] = "";
        },
        setUpdateObject: (state, action) => {
            const { _id, code, status } = action.payload;
            state.updateObject["id"] = _id;
            state.updateObject["code"] = code;
            state.updateObject["status"] = status;
        },
        setDeleteObject: (state, action) => {
            const { _id, code } = action.payload;
            state.deleteObject["id"] = _id;
            state.deleteObject["code"] = code;
        },
        checkValidation: (state) => {
            state.errors["discount"] =
                state.createObject["discount"] !== "none"
                    ? ""
                    : "This field is required";
            state.isValid = !state.errors["discount"];
        },
        setCreateCompleted: (state) => {
            state.createCompleted = false;
        },
        setUpdateCompleted: (state) => {
            state.updateCompleted = false;
        },
        setDeleteCompleted: (state) => {
            state.deleteCompleted = false;
        },
        setError: (state) => {
            state.error = null;
        },
        clearState: (state) => {
            state.createObject = initialState.createObject;
            state.updateObject = initialState.updateObject;
            state.deleteObject = initialState.deleteObject;
            state.errors = initialState.errors;
        },
    },
    extraReducers: (builder) => {
        // get all vouchers
        builder.addCase(fetchVouchers.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { vouchers, totalVoucher } = payload.metadata;
                    state.vouchers = vouchers;
                    state.totalPages = Math.ceil(
                        totalVoucher / process.env.REACT_APP_PRODUCT_LIMIT
                    );
                    break;

                default:
                    break;
            }
        });
        // create voucher api
        builder.addCase(createVoucher.fulfilled, (state, { payload }) => {
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
        // update voucher api
        builder.addCase(updateVoucher.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.updateCompleted = true;
                    break;

                default:
                    state.error = payload.message;
                    break;
            }
        });
        // delete voucher api
        builder.addCase(deleteVoucher.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.deleteCompleted = true;
                    break;

                default:
                    state.error = payload.message;
                    break;
            }
        });
    },
});

// get vouchers
export const fetchVouchers = createAsyncThunk(
    "voucher/fetchVouchers",
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
        const response = await api.get("/voucher?" + query);
        return response.data;
    }
);

// create voucher
export const createVoucher = createAsyncThunk(
    "voucher/createVoucher",
    async (discount, { getState, dispatch }) => {
        dispatch(checkValidation());
        const state = getState()["voucher"];

        if (state.isValid) {
            const response = await api.post(`/voucher/`, { discount });
            return response.data;
        }
    }
);

// update voucher by id
export const updateVoucher = createAsyncThunk(
    "voucher/updateVoucher",
    async ({ id, status }) => {
        const response = await api.post(`/voucher/${id}`, { status });
        return response.data;
    }
);

// soft delete voucher by id
export const deleteVoucher = createAsyncThunk(
    "voucher/deleteVoucher",
    async (id) => {
        const response = await api.delete(`/voucher/${id}`);
        return response.data;
    }
);

export const {
    handleOnChange,
    handleUpdateOnChange,
    setDeleteObject,
    setUpdateObject,
    checkValidation,
    checkUpdateValidation,
    setCreateCompleted,
    setUpdateCompleted,
    setDeleteCompleted,
    setError,
    clearState,
} = voucherSlice.actions;
