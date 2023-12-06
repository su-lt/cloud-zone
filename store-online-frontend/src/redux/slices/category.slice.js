import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    dependencies: 0,
    completed: false,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        clearState: (state) => {
            state = initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
            state.categories = payload.categories;
            state.completed = false;
        });
        builder.addCase(createCategory.fulfilled, (state, { payload }) => {
            state.completed = true;
        });
        builder.addCase(updateCategory.fulfilled, (state, { payload }) => {
            state.completed = true;
        });
        builder.addCase(deleteCategory.fulfilled, (state, { payload }) => {
            state.completed = true;
        });
        builder.addCase(
            totalProductByCategoryId.fulfilled,
            (state, { payload }) => {
                state.dependencies = payload.totalProduct;
            }
        );
    },
});

// get categories
export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async () => {
        const response = await api.get("/category/");
        return response.data.metadata;
    }
);

// create category
export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (name) => {
        const response = await api.post(`/category/`, { name });
        return response.data.metadata;
    }
);

// update category by id
export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async ({ id, name }) => {
        const response = await api.post(`/category/${id}`, { name });
        return response.data.metadata;
    }
);

// soft delete category by id
export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id) => {
        const response = await api.delete(`/category/${id}`);
        return response.data.metadata;
    }
);

// soft delete category by id
export const totalProductByCategoryId = createAsyncThunk(
    "category/totalProductByCategoryId",
    async (id) => {
        const response = await api.get(`/category/dependence/${id}`);
        return response.data.metadata;
    }
);
