import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";
import * as XLSX from "xlsx";

const initialState = {
    orders: [],
    totalOrders: 0,
    totalPrices: 0,
    updateObject: null,
    deleteObject: {
        id: "",
        code: "",
    },
    updateCompleted: false,
    deleteCompleted: false,
    exportCompleted: false,
    totalPages: 0,
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
        setDeleteObject: (state, action) => {
            state.deleteObject = action.payload;
        },
        setUpdateCompleted: (state) => {
            state.updateCompleted = false;
        },
        setDeleteCompleted: (state) => {
            state.deleteCompleted = false;
        },
        setExportCompleted: (state) => {
            state.exportCompleted = false;
        },
        setError: (state) => {
            state.error = null;
        },
        clearState: (state) => {
            state.updateObject = initialState.updateObject;
            state.exportCompleted = initialState.exportCompleted;
            state.error = initialState.error;
        },
    },
    extraReducers: (builder) => {
        // get orders
        builder.addCase(fetchOrders.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.orders = payload.orders;
            state.totalPages = Math.ceil(
                payload.totalOrders / process.env.REACT_APP_PRODUCT_LIMIT
            );
        });
        builder.addCase(fetchOrders.rejected, (state, { error }) => {
            state.pending = false;
            // state.error = error.message;
        });
        builder.addCase(fetchOrders.pending, (state, { payload }) => {
            state.pending = true;
        });
        // get order by id
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
        // post update
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
        // post delete
        builder.addCase(deleteOrder.fulfilled, (state) => {
            state.pending = false;
            state.deleteCompleted = true;
        });
        builder.addCase(deleteOrder.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(deleteOrder.pending, (state, { payload }) => {
            state.pending = true;
        });
        // export orders
        builder.addCase(exportOrders.fulfilled, (state, { payload }) => {
            if (payload.orders.length > 0) {
                // map data
                const data = payload.orders.map((order, index) => [
                    index + 1,
                    order.code,
                    order.user.fullname,
                    order.address,
                    "$ " + order.totalPrice,
                    order.status,
                    new Date(order.createdAt).toLocaleDateString("en-GB") +
                        "-" +
                        new Date(order.updatedAt).toLocaleTimeString(),
                ]);

                // set header cols
                const header = [
                    "#",
                    "Order Code",
                    "User",
                    "Address",
                    "Total Price",
                    "Status",
                    "Order Date",
                ];
                data.unshift(header);

                // create worksheet from data
                const worksheet = XLSX.utils.aoa_to_sheet(data);
                // set size cols
                worksheet["!cols"] = [
                    { width: 3 }, // order id
                    { width: 15 }, // order code
                    { width: 20 }, // username
                    { width: 60 }, // address
                    { width: 12 }, // total price
                    { width: 15 }, // status
                    { width: 45 }, // order date
                ];

                // create workbook and add worksheet
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

                // format filename "report-orders-DD-MM-YYYY.xlsx"
                const formattedDate = new Date()
                    .toLocaleDateString("en-GB")
                    .replaceAll("/", "-");
                // save temporary file
                const tempFilePath = `report-orders-${formattedDate}.xlsx`;

                // create file
                XLSX.writeFileXLSX(workbook, tempFilePath);

                // set state
                state.exportCompleted = true;
            }
            state.pending = false;
        });
        builder.addCase(exportOrders.pending, (state, { payload }) => {
            state.pending = true;
        });
        // fetch total except cancel status
        builder.addCase(fetchTotalOrder.fulfilled, (state, { payload }) => {
            state.totalOrders = payload.count;
            state.totalPrices = payload.totalPrices;
        });
    },
});

// get orders
export const fetchOrders = createAsyncThunk(
    "order/fetchOrders",
    async ({ searchString, page, limit, status, startDate, endDate }) => {
        const query = buildQueryString({
            searchString,
            limit,
            status,
            startDate,
            endDate,
            page,
        });
        const response = await api.get("/order?" + query);
        return response.data.metadata;
    }
);

// get order
export const fetchOrderById = createAsyncThunk(
    "order/fetchOrderById",
    async (id) => {
        const response = await api.get("/order/" + id);
        return response.data.metadata;
    }
);

// update orders
export const updateOrder = createAsyncThunk(
    "order/updateOrder",
    async ({ _id, status, note }) => {
        const response = await api.patch("/order/" + _id, {
            status,
            note,
        });
        return response.data.metadata;
    }
);

// delete order
export const deleteOrder = createAsyncThunk("order/deleteOrder", async (id) => {
    const response = await api.delete("/order/" + id);
    return response.data.metadata;
});

// export orders
export const exportOrders = createAsyncThunk(
    "order/exportOrders",
    async ({ searchString, page, limit, status, startDate, endDate }) => {
        const query = buildQueryString({
            searchString,
            limit,
            status,
            startDate,
            endDate,
            page,
        });
        const response = await api.get("/order/report?" + query);
        return response.data.metadata;
    }
);

// count total order
export const fetchTotalOrder = createAsyncThunk(
    "category/fetchTotalOrder",
    async () => {
        const response = await api.get("/order/totalOrder");
        return response.data.metadata;
    }
);

export const {
    handleOnChangeUpdate,
    setDeleteObject,
    setUpdateCompleted,
    setDeleteCompleted,
    setExportCompleted,
    setError,
    clearState,
} = orderSlice.actions;
