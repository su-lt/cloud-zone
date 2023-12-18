import api from "../../helpers/axiosApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryString } from "../../helpers/ultil";

const initialState = {
    products: [],
    product: null,
    totalProducts: 0,
    popularProducts: [],
    deleteObject: {
        id: "",
        name: "",
    },
    updateObject: {
        id: "",
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
        quantity: "",
        brand: "",
        description: "",
        category: "",
        productDetail: "",
        status: "",
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
        setProductObject: (state, action) => {
            const { field, value } = action.payload;
            state.productObject[field] = value;
            state.errors[field] = "";
        },
        setUpdateObject: (state, action) => {
            const { field, value } = action.payload;
            state.updateObject[field] = value;
            state.errors[field] = "";
        },
        setDeleteObject: (state, action) => {
            const { id, name } = action.payload;
            state.deleteObject["id"] = id;
            state.deleteObject["name"] = name;
        },
        checkValidation: (state) => {
            // check all field before submit
            Object.keys(state.productObject).forEach((field) => {
                if (field !== "color") {
                    state.errors[field] =
                        String(state.productObject[field]).trim() &&
                        String(state.productObject[field]) !== "0"
                            ? ""
                            : "This field is required";
                }
            });
            // add errors
            const userObjectFields = Object.keys(state.productObject);
            state.isValid = userObjectFields.every(
                (field) => !state.errors[field]
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
            // add errros
            const userObjectFields = Object.keys(state.updateObject);
            state.isValid = userObjectFields.every(
                (field) => !state.errors[field]
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
        // fetch related product by id
        builder.addCase(
            fetchRelatedProductById.fulfilled,
            (state, { payload }) => {
                state.relatedProducts = payload.relatedProducts;
            }
        );
        // fetch product by slug
        builder.addCase(fetchProductBySlug.fulfilled, (state, { payload }) => {
            state.product = payload.product;
        });
        builder.addCase(fetchProductBySlug.rejected, (state, { error }) => {
            state.error = error.message;
        });
        // fetch product by id
        builder.addCase(fetchProductById.fulfilled, (state, { payload }) => {
            const { product } = payload;
            if (product)
                state.updateObject = {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    quantity: product.quantity,
                    status: product.status,
                    brand: product.productDetail.brand,
                    description: product.productDetail.description,
                    productDetail: product.productDetail._id,
                    color: product.productDetail.color,
                    images: product.productDetail.images,
                };
        });
        // handle fetch all products
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
        // handle create product
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
        // handle update api
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
        // handle delete api
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
        // total products
        builder.addCase(fetchTotalProducts.fulfilled, (state, { payload }) => {
            state.totalProducts = payload.count;
        });
        // popular products
        builder.addCase(
            fetchPopularProducts.fulfilled,
            (state, { payload }) => {
                state.popularProducts = payload.products;
            }
        );
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
        const response = await api.get("/product?" + query);
        return response.data.metadata;
    }
);

// create new product
export const createProduct = createAsyncThunk(
    "product/createProduct",
    async ({ images }, { getState, dispatch }) => {
        // check validation before creating product
        dispatch(checkValidation());
        const state = getState()["product"];

        if (state.isValid) {
            const create = state.productObject;
            // create form
            const data = new FormData();
            // add to form
            images.forEach((element) => {
                data.append("images", element);
            });
            Object.keys(create).forEach((field) => {
                data.append(field, create[field]);
            });

            // send data to server
            const response = await api.post("/product/", data, {
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
        // check validation
        dispatch(checkUpdateValidation());
        const state = getState()["product"];

        if (state.isValid) {
            const updateObj = state.updateObject;
            // create form
            const data = new FormData();
            images.forEach((element) => {
                data.append("images", element);
            });
            Object.keys(updateObj).forEach((field) => {
                data.append(field, updateObj[field]);
            });

            // send data to server
            const response = await api.put("/product/" + updateObj.id, data, {
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
        const response = await api.delete("/product/" + id);

        return response.data.metadata;
    }
);

// get product by id
export const fetchProductById = createAsyncThunk(
    "product/fetchProductById",
    async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data.metadata;
    }
);

// get product by id
export const fetchProductBySlug = createAsyncThunk(
    "product/fetchProductBySlug",
    async (slug) => {
        const response = await api.get(`/product/slug/${slug}`);
        return response.data.metadata;
    }
);

// get related products
export const fetchRelatedProductById = createAsyncThunk(
    "product/fetchRelatedProductById",
    async (id) => {
        const response = await api.post(`/product/related/${id}`);
        return response.data.metadata;
    }
);

// count total products
export const fetchTotalProducts = createAsyncThunk(
    "product/fetchTotalProducts",
    async () => {
        const response = await api.get(`/product/totalProducts`);
        return response.data.metadata;
    }
);

// fetch popular products
export const fetchPopularProducts = createAsyncThunk(
    "product/fetchPopularProducts",
    async () => {
        const response = await api.get(`/product/popularProducts`);
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
