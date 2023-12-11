import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    products: [],
    product: null,
    deleteObject: {
        id: "",
        name: "",
    },
    updateObject: {
        name: "",
        price: "",
        quantity: "",
        brand: "",
        description: "",
        category: "",
        productDetail: "",
        color: "",
        status: "",
        images: [],
    },
    productObject: {
        name: "",
        price: "",
        category: "",
        quantity: "",
        brand: "",
        description: "",
        color: "",
    },
    errors: {
        name: "",
        price: "",
        category: "",
        quantity: "",
        brand: "",
        description: "",
    },
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
    isValid: false,
    createCompleted: false,
    updateCompleted: false,
    deleteCompleted: false,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // loadAllProducts: (state, action) => {
        //     state.products = action.payload;
        // },
        setProductObject: (state, action) => {
            const { field, value } = action.payload;
            state.productObject[field] = value;
        },
        setUpdateObject: (state, action) => {
            const { field, value } = action.payload;
            state.updateObject[field] = value;
        },
        setDeleteObject: (state, action) => {
            const { id, name } = action.payload;
            state.deleteObject["id"] = id;
            state.deleteObject["name"] = name;
        },
        checkValidation: (state) => {
            Object.keys(state.productObject).forEach((field) => {
                if (field !== "color") {
                    state.errors[field] =
                        String(state.productObject[field]).trim() &&
                        String(state.productObject[field]) !== "0"
                            ? ""
                            : "This field is required";
                }
            });
            state.isValid = Object.values(state.errors).every(
                (error) => !error
            );
        },
        checkUpdateValidation: (state) => {
            Object.keys(state.updateObject).forEach((field) => {
                if (
                    field !== "id" &&
                    field !== "color" &&
                    field !== "images" &&
                    field !== "status"
                ) {
                    state.errors[field] =
                        String(state.updateObject[field]).trim() &&
                        String(state.updateObject[field]) !== "0"
                            ? ""
                            : "This field is required";
                }
            });
            state.isValid = Object.values(state.errors).every(
                (error) => !error
            );
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
            state.searchString = action.payload.trim();
        },
        setSearchCategory: (state, action) => {
            state.searchCategory = action.payload;
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
            return {
                ...state,
                productObject: initialState.productObject,
                updateObject: initialState.updateObject,
                deleteObject: initialState.deleteObject,
                errors: initialState.errors,
                error: null,
            };
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
            const { product } = payload;
            if (product)
                state.updateObject = {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    quantity: product.productDetail.quantity,
                    brand: product.productDetail.brand,
                    description: product.productDetail.description,
                    productDetail: product.productDetail._id,
                    color: product.productDetail.color,
                    status: product.status,
                    images: product.productDetail.images,
                };
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
        builder.addCase(createProduct.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                state.createCompleted = true;
            }
        });
        builder.addCase(createProduct.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(createProduct.pending, (state) => {
            state.pending = true;
        });
        builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload) {
                state.updateCompleted = true;
            }
        });
        builder.addCase(updateProduct.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(updateProduct.pending, (state) => {
            state.pending = true;
        });
        builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
            state.pending = false;
            state.deleteCompleted = true;
        });
        builder.addCase(deleteProduct.rejected, (state, { error }) => {
            state.pending = false;
            state.error = error.message;
        });
        builder.addCase(deleteProduct.pending, (state) => {
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
        defaultConfig,
    }) => {
        const query = buildQueryString({
            page,
            limit,
            minPrice,
            maxPrice,
            searchString,
            searchCategory,
            defaultConfig,
        });
        const response = await api.get("/products?" + query);
        return response.data.metadata;
    }
);

// create new product
export const createProduct = createAsyncThunk(
    "product/createProduct",
    async ({ images }, { getState, dispatch }) => {
        dispatch(checkValidation());
        const state = getState()["product"];

        if (state.isValid) {
            const create = state.productObject;
            const data = new FormData();
            images.forEach((element) => {
                data.append("images", element);
            });
            Object.keys(create).forEach((field) => {
                data.append(field, create[field]);
            });

            const response = await api.post("/products/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.metadata;
        }

        return null;
    }
);

// update product
export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({ images }, { getState, dispatch }) => {
        dispatch(checkUpdateValidation());
        const state = getState()["product"];

        if (state.isValid) {
            const updateObj = state.updateObject;

            const data = new FormData();
            images.forEach((element) => {
                data.append("images", element);
            });
            Object.keys(updateObj).forEach((field) => {
                data.append(field, updateObj[field]);
            });
            const response = await api.put("/products/" + updateObj.id, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.metadata;
        }

        return null;
    }
);

// delete product
export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id) => {
        const response = await api.delete("/products/" + id);

        return response.data.metadata;
    }
);

// get product by id
export const fetchProductById = createAsyncThunk(
    "product/fetchProductById",
    async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data.metadata;
    }
);

// get product by id
export const fetchProductBySlug = createAsyncThunk(
    "product/fetchProductBySlug",
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

export const {
    setProductObject,
    setUpdateObject,
    setDeleteObject,
    checkValidation,
    checkUpdateValidation,
    setCreateCompleted,
    setUpdateCompleted,
    setDeleteCompleted,
    clearState,
    setError,
} = productSlice.actions;
