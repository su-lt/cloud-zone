import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    categories: [],
    createObject: {
        name: "",
    },
    updateObject: {
        name: "",
    },
    deleteObject: {
        name: "",
    },
    errors: {
        name: "",
    },
    dependencies: 0,
    createCompleted: false,
    updateCompleted: false,
    deleteCompleted: false,
    pending: false,
    error: null,
    isValid: false,
    totalPages: 0,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        handleOnChange: (state, action) => {
            const { field, value } = action.payload;
            state.createObject[field] = value;
            state.errors[field] = "";
        },
        handleUpdateOnChange: (state, action) => {
            const { field, value } = action.payload;
            state.updateObject[field] = value;
            state.errors[field] = "";
        },
        setUpdateObject: (state, action) => {
            state.updateObject = action.payload;
        },
        setDeleteObject: (state, action) => {
            state.deleteObject = action.payload;
        },
        checkValidation: (state) => {
            state.errors["name"] = state.createObject["name"].trim()
                ? ""
                : "This field is required";
            state.isValid = !state.errors["name"];
        },
        checkUpdateValidation: (state) => {
            state.errors["name"] = state.updateObject["name"].trim()
                ? ""
                : "This field is required";
            state.isValid = !state.errors["name"];
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
            state.dependencies = initialState.dependencies;
        },
    },
    extraReducers: (builder) => {
        // get all categories
        builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
            state.completed = false;
            state.categories = payload.categories;
            state.totalPages = Math.ceil(
                payload.totalCategories / process.env.REACT_APP_PRODUCT_LIMIT
            );
        });
        // create a new category
        builder.addCase(createCategory.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                state.createCompleted = true;
            }
        });
        builder.addCase(createCategory.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(createCategory.pending, (state, { payload }) => {
            state.pending = true;
        });
        // update a category
        builder.addCase(updateCategory.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                state.updateCompleted = true;
            }
        });
        builder.addCase(updateCategory.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(updateCategory.pending, (state, { payload }) => {
            state.pending = true;
        });
        // delete a category
        builder.addCase(deleteCategory.fulfilled, (state) => {
            state.pending = false;
            state.deleteCompleted = true;
        });
        builder.addCase(deleteCategory.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(deleteCategory.pending, (state, { payload }) => {
            state.pending = true;
        });
        // count all products by category
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
    async ({ searchString, page }) => {
        const query = buildQueryString({
            searchString,
            page,
        });
        const response = await api.get("/category?" + query);
        return response.data.metadata;
    }
);

// create category
export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (name, { getState, dispatch }) => {
        dispatch(checkValidation());
        const state = getState()["category"];

        if (state.isValid) {
            const response = await api.post(`/category/`, { name });
            return response.data.metadata;
        }
        return null;
    }
);

// update category by id
export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async ({ id, name }, { getState, dispatch }) => {
        dispatch(checkUpdateValidation());
        const state = getState()["category"];

        if (state.isValid) {
            const response = await api.post(`/category/${id}`, { name });
            return response.data.metadata;
        }
        return null;
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
} = categorySlice.actions;
