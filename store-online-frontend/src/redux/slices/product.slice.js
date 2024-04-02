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
        removeImageObject: (state, action) => {
            state.updateObject.images = state.updateObject.images.filter(
                (i) => i.filename !== action.payload
            );
        },
        checkValidation: (state) => {
            // check all field before submit
            Object.keys(state.productObject).forEach((field) => {
                state.errors[field] =
                    String(state.productObject[field]).trim() &&
                    String(state.productObject[field]) !== "0"
                        ? ""
                        : "This field is required";
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
        clearProductsState: (state) => {
            state.products = initialState.products;
            state.totalProducts = initialState.totalProducts;
            state.totalPages = initialState.totalPages;
            state.pending = initialState.pending;
            state.error = initialState.error;
        },
    },
    extraReducers: (builder) => {
        // fetch related product by id
        builder.addCase(
            fetchRelatedProductById.fulfilled,
            (state, { payload }) => {
                switch (payload.status) {
                    case "success":
                        const { relatedProducts } = payload.metadata;
                        state.relatedProducts = relatedProducts;
                        break;
                    default:
                        break;
                }
            }
        );
        // fetch product by slug
        builder.addCase(fetchProductBySlug.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { product } = payload.metadata;
                    state.product = product;
                    break;
                default:
                    if (payload.message === "404") state.error = "404";
                    else state.error = payload.message;
                    break;
            }
        });
        // fetch product by id
        builder.addCase(fetchProductById.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { product } = payload.metadata;
                    // push data to update object
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
                        images: product.productDetail.images,
                    };
                    break;
                default:
                    break;
            }
        });
        // handle fetch all products
        builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { products, totalProducts } = payload.metadata;
                    state.pending = false;
                    state.error = null;
                    state.product = null;
                    state.products = products;
                    state.totalPages = Math.ceil(
                        totalProducts / process.env.REACT_APP_PRODUCT_LIMIT
                    );
                    break;
                default:
                    state.pending = false;
                    state.products = [];
                    break;
            }
        });
        // handle fetch products continously
        builder.addCase(
            fetchProductsContinuous.fulfilled,
            (state, { payload }) => {
                switch (payload.status) {
                    case "success":
                        const { products, totalProducts } = payload.metadata;
                        state.pending = false;
                        state.error = null;
                        state.product = null;
                        state.products = products;
                        state.totalPages = Math.ceil(
                            totalProducts / process.env.REACT_APP_PRODUCT_LIMIT
                        );
                        break;
                    default:
                        state.pending = false;
                        state.products = [];
                        break;
                }
            }
        );
        builder.addCase(fetchProducts.pending, (state) => {
            state.pending = true;
        });
        // handle create product
        builder.addCase(createProduct.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload)
                switch (payload.status) {
                    case "success":
                        state.createCompleted = true;
                        break;
                    default:
                        state.error = payload.message;
                        break;
                }
        });
        builder.addCase(createProduct.pending, (state) => {
            state.pending = true;
        });
        // handle update api
        builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
            state.pending = false;
            if (payload)
                switch (payload.status) {
                    case "success":
                        state.updateCompleted = true;
                        break;
                    default:
                        state.error = payload.message;
                        break;
                }
        });
        builder.addCase(updateProduct.pending, (state) => {
            state.pending = true;
        });
        // handle delete api
        builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    state.pending = false;
                    state.deleteCompleted = true;
                    break;
                default:
                    state.pending = false;
                    state.error = payload.message;
                    break;
            }
        });
        builder.addCase(deleteProduct.pending, (state) => {
            state.pending = true;
        });
        // total products
        builder.addCase(fetchTotalProducts.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { total } = payload.metadata;
                    state.totalProducts = total;
                    break;
                default:
                    break;
            }
        });
        // popular products
        builder.addCase(
            fetchPopularProducts.fulfilled,
            (state, { payload }) => {
                switch (payload.status) {
                    case "success":
                        const { products } = payload.metadata;
                        state.popularProducts = products;
                        break;
                    default:
                        break;
                }
            }
        );
    },
});

// thunk
// fetch products per page
export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async ({
        minPrice,
        maxPrice,
        searchString,
        searchCategory,
        status,
        sort,
        page,
        limit = process.env.REACT_APP_PRODUCT_LIMIT,
        defaultConfig,
    }) => {
        const query = buildQueryString({
            minPrice,
            maxPrice,
            searchString,
            searchCategory,
            status,
            sort,
            page,
            limit,
            defaultConfig,
        });
        const response = await api.get("/product?" + query);
        return response.data;
    }
);

// fetch products continuously
export const fetchProductsContinuous = createAsyncThunk(
    "product/fetchProductsContinuous",
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
        const response = await api.get("/product/orderProducts?" + query);
        return response.data;
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
            return response.data;
        }
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
            return response.data;
        }
    }
);

// delete product
export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id) => {
        const response = await api.delete("/product/" + id);
        return response.data;
    }
);

// delete image from server side
export const deleteImage = createAsyncThunk(
    "product/deleteImage",
    async ({ id, image }) => {
        const response = await api.delete(
            "/product/remove/" + id + "?filename=" + image
        );
        return response.data;
    }
);

// get product by id
export const fetchProductById = createAsyncThunk(
    "product/fetchProductById",
    async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data;
    }
);

// get product by id
export const fetchProductBySlug = createAsyncThunk(
    "product/fetchProductBySlug",
    async (slug) => {
        const response = await api.get(`/product/slug/${slug}`);
        return response.data;
    }
);

// get related products
export const fetchRelatedProductById = createAsyncThunk(
    "product/fetchRelatedProductById",
    async (id) => {
        const response = await api.post(`/product/related/${id}`);
        return response.data;
    }
);

// count total products
export const fetchTotalProducts = createAsyncThunk(
    "product/fetchTotalProducts",
    async () => {
        const response = await api.get(`/product/totalProducts`);
        return response.data;
    }
);

// fetch popular products
export const fetchPopularProducts = createAsyncThunk(
    "product/fetchPopularProducts",
    async () => {
        const response = await api.get(`/product/popularProducts`);
        return response.data;
    }
);

export const {
    setProductObject,
    setUpdateObject,
    setDeleteObject,
    removeImageObject,
    checkValidation,
    checkUpdateValidation,
    setCreateCompleted,
    setUpdateCompleted,
    setDeleteCompleted,
    clearState,
    clearProductsState,
    setError,
} = productSlice.actions;
