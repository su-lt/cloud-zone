import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    updateObject: null,
    updateCompleted: false,
    deleteCompleted: false,
    pending: false,
    error: null,
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        handleOnChangeUpdate: (state, action) => {
            const { field, value } = action.payload;
            state.updateObject[field] = value;
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
            state.updateObject = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.orders = payload.orders;
        });
        builder.addCase(fetchOrders.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(fetchOrders.pending, (state, { payload }) => {
            state.pending = true;
        });
        builder.addCase(fetchOrderById.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.updateObject = payload.order;
        });
        builder.addCase(fetchOrderById.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(fetchOrderById.pending, (state, { payload }) => {
            state.pending = true;
        });
        builder.addCase(updateOrder.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.updateCompleted = true;
        });
        builder.addCase(updateOrder.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(updateOrder.pending, (state, { payload }) => {
            state.pending = true;
        });
    },
});

// get orders
export const fetchOrders = createAsyncThunk(
    "category/fetchOrders",
    async () => {
        const response = await api.get("/order/");
        return response.data.metadata;
    }
);

// get orders
export const fetchOrderById = createAsyncThunk(
    "category/fetchOrderById",
    async (id) => {
        const response = await api.get("/order/" + id);
        return response.data.metadata;
    }
);

// update orders
export const updateOrder = createAsyncThunk(
    "category/updateOrder",
    async ({ _id, status, note }) => {
        const response = await api.patch("/order/" + _id, {
            status,
            note,
        });
        return response.data.metadata;
    }
);

export const {
    handleOnChangeUpdate,
    setUpdateCompleted,
    setDeleteCompleted,
    setError,
    clearState,
} = orderSlice.actions;
