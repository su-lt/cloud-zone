import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    products: [],
    product: null,
    categories: [],
    relatedProducts: [],
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
        },
        clearState: (state) => {
            state = initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            fetchRelatedProductById.fulfilled,
            (state, { payload }) => {
                state.relatedProducts = payload.relatedProducts;
            }
        );
        builder.addCase(fetchProductById.fulfilled, (state, { payload }) => {
            state.product = payload.product;
        });
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
        const response = await api.get("/products?" + query);

        return response.data.metadata;
    }
);

// get categories
export const fetchCategories = createAsyncThunk(
    "product/fetchCategories",
    async () => {
        const response = await api.get("/products/categories");
        return response.data.metadata;
    }
);

// get product by id
export const fetchProductById = createAsyncThunk(
    "product/fetchProductById",
    async (id) => {
        const response = await api.post(`/products/${id}`);
        return response.data.metadata;
    }
);

// get related products
export const fetchRelatedProductById = createAsyncThunk(
    "product/fetchRelatedProductById",
    async (id) => {
        const response = await api.post(`/products/related/${id}`);
        return response.data.metadata;
    }
);
