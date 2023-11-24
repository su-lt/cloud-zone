import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    products: [],
    categories: [],
    minPrice: "",
    maxPrice: "",
    searchString: "",
    searchCategory: "",
    page: 1,
    limit: 12,
    totalPages: 0,
    pending: false,
    error: null,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        loadAllProducts: (state, action) => {
            state.products = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setMaxPrice: (state, action) => {
            state.maxPrice = action.payload;
        },
        setMinPrice: (state, action) => {
            state.minPrice = action.payload;
        },
        setSearchString: (state, action) => {
            state.searchString = action.payload;
        },
        setSearchCategory: (state, action) => {
            state.searchCategory = action.payload;
            console.log("state.searchCategory", state.searchCategory);
        },
        clearState: (state) => {
            state = initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
            state.categories = payload.categories;
        });
        builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.products = payload.products;
            state.totalPages = Math.ceil(payload.totalProducts / state.limit);
        });
        builder.addCase(fetchProducts.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(fetchProducts.pending, (state) => {
            state.pending = true;
        });
    },
});

// thunk
export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async ({
        page,
        limit,
        minPrice,
        maxPrice,
        searchString,
        searchCategory,
    }) => {
        const query = buildQueryString({
            page,
            limit,
            minPrice,
            maxPrice,
            searchString,
            searchCategory,
        });
        const response = await api.post("/products?" + query);

        return response.data.metadata;
    }
);

export const fetchCategories = createAsyncThunk(
    "product/fetchCategories",
    async () => {
        const response = await api.post("/categories");
        return response.data.metadata;
    }
);
