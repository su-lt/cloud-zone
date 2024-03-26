import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    categories: [],
    uncategory: 0,
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
            switch (payload.status) {
                case "success":
                    const { categories, totalCategories } = payload.metadata;
                    state.completed = false;
                    state.categories = categories;
                    state.totalPages = Math.ceil(
                        totalCategories / process.env.REACT_APP_PRODUCT_LIMIT
                    );
                    break;
                default:
                    break;
            }
        });
        // get total uncategory products
        builder.addCase(fetchUncategories.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { totalProducts } = payload.metadata;
                    state.uncategory = totalProducts;
                    break;
                default:
                    break;
            }
        });
        // create a new category
        builder.addCase(createCategory.fulfilled, (state, { payload }) => {
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
        builder.addCase(createCategory.pending, (state, { payload }) => {
            state.pending = true;
        });
        // update a category
        builder.addCase(updateCategory.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                switch (payload.status) {
                    case "success":
                        state.updateCompleted = true;
                        break;
                    default:
                        state.error = payload.message;
                        break;
                }
            }
        });
        builder.addCase(updateCategory.pending, (state, { payload }) => {
            state.pending = true;
        });
        // delete a category
        builder.addCase(deleteCategory.fulfilled, (state, { payload }) => {
            state.pending = false;
            switch (payload.status) {
                case "success":
                    state.deleteCompleted = true;
                    break;
                default:
                    state.error = payload.message;
                    break;
            }
        });
        builder.addCase(deleteCategory.pending, (state, { payload }) => {
            state.pending = true;
        });
    },
});

// get categories
export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async ({ searchString, page, limit, loadAll }) => {
        const query = buildQueryString({
            searchString,
            page,
            limit,
            loadAll,
        });
        const response = await api.get("/category?" + query);
        return response.data;
    }
);

// get uncategories
export const fetchUncategories = createAsyncThunk(
    "category/fetchUncategories",
    async () => {
        const response = await api.get("/category/uncategory");
        return response.data;
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
            return response.data;
        }
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
            return response.data;
        }
        return null;
    }
);

// soft delete category by id
export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id) => {
        const response = await api.delete(`/category/${id}`);
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
} = categorySlice.actions;
