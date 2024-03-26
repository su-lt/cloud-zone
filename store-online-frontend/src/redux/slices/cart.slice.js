import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { provinceApi } from "../../helpers/axiosApi";

const initialState = {
    cart: [],
    totalQuantity: 0,
    totalPrice: 0,
    voucher: "",
    discount: 0,
    address: {
        city: "",
        district: "",
        ward: "",
        street: "",
    },
    fullAddress: "",
    cities: [],
    districts: [],
    wards: [],
    pending: false,
    createCompleted: false,
    orderError: null,
    orderCode: "",
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        loadCart: (state, action) => {
            state.cart = action.payload;
            state.totalQuantity = state.cart.reduce(
                (total, item) => total + item.quantity,
                0
            );
            state.totalPrice = state.cart.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );
        },
        addToCart: (state, action) => {
            const cartObject = action.payload;

            // if cart exists
            if (state.cart.length > 0) {
                // check product exist in cart
                const foundIndex = state.cart.findIndex(
                    (item) => item._id === cartObject._id
                );

                // if product found, increase quantity
                if (foundIndex !== -1) {
                    state.cart[foundIndex].quantity += cartObject.quantity;
                } else {
                    // if product not found
                    state.cart.push(cartObject);
                }
            } else {
                // if cart is empty
                state.cart.push(cartObject);
            }
            state.totalQuantity = state.cart.reduce(
                (total, item) => total + item.quantity,
                0
            );
            state.totalPrice = state.cart.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            // add cart to local storage
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        handleVoucherOnChange: (state, action) => {
            state.voucher = action.payload;
        },
        updateQuantity: (state, action) => {
            const cartObject = action.payload;

            // found index in cart
            const foundIndex = state.cart.findIndex(
                (item) => item._id === cartObject._id
            );

            if (foundIndex !== -1) {
                state.cart[foundIndex].quantity =
                    parseInt(cartObject.quantity) || 1;
            }

            state.totalQuantity = state.cart.reduce(
                (total, item) => total + item.quantity,
                0
            );
            state.totalPrice = state.cart.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            // add cart to local storage
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        removeProduct: (state, action) => {
            state.cart = state.cart.filter(
                (item) => item._id !== action.payload
            );

            state.totalQuantity = state.cart.reduce(
                (total, item) => total + item.quantity,
                0
            );
            state.totalPrice = state.cart.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            );

            // add cart to local storage
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        setAddress: (state, action) => {
            const { field, value } = action.payload;
            state.address[field] = value;
        },
        setFullAddress: (state, action) => {
            state.fullAddress = action.payload;
        },
        clearAddress: (state, action) => {
            state.address = initialState.address;
        },
        clearCartState: (state) => {
            state.createCompleted = initialState.createCompleted;
            state.orderCode = initialState.orderCode;
        },
    },
    extraReducers: (builder) => {
        // fetch product by id
        builder.addCase(fetchProductById.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { product } = payload.metadata;
                    const foundIndex = state.cart.findIndex(
                        (item) => item._id === product._id
                    );
                    // if product found, increase quantity
                    if (foundIndex !== -1) {
                        state.cart[foundIndex].name = product.name;
                        state.cart[foundIndex].stock = product.quantity;
                        state.cart[foundIndex].image_thumbnail =
                            product.image_thumbnail;
                        state.cart[foundIndex].out_of_stock =
                            product.quantity > 0 ? false : true;
                    }
                    break;

                default:
                    break;
            }
        });
        // fetch voucher by code
        builder.addCase(fetchVoucherByCode.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { voucher } = payload.metadata;
                    state.discount = voucher.discount;
                    break;

                case "none-voucher":
                    state.discount = 0;
                    break;

                default:
                    state.discount = -1;
                    break;
            }
        });
        // fetch cities
        builder.addCase(fetchCities.fulfilled, (state, { payload }) => {
            console.log(":::", payload);
            state.cities = payload;
        });
        // fetch districts
        builder.addCase(fetchDistricts.fulfilled, (state, { payload }) => {
            state.districts = payload;
        });
        // fetch wards
        builder.addCase(fetchWards.fulfilled, (state, { payload }) => {
            state.wards = payload;
        });
        // create order
        builder.addCase(createOrder.fulfilled, (state, { payload }) => {
            switch (payload.status) {
                case "success":
                    const { order } = payload.metadata;
                    state.orderCode = order.code;
                    state.createCompleted = true;
                    // clear cartstate
                    state.cart = initialState.cart;
                    state.totalPrice = initialState.totalPrice;
                    state.totalQuantity = initialState.totalQuantity;
                    // clear cart in local storage
                    localStorage.removeItem("cart");
                    break;

                default:
                    state.orderCode = payload.message;
                    break;
            }
        });
    },
});

// get product by id
export const fetchProductById = createAsyncThunk(
    "cart/fetchProductById",
    async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data;
    }
);

// get voucher by code
export const fetchVoucherByCode = createAsyncThunk(
    "cart/fetchVoucherByCode",
    async (code) => {
        if (code) {
            const response = await api.get(`/voucher/${code}`);
            return response.data;
        }
        return { status: "none-voucher" };
    }
);

// get cities
export const fetchCities = createAsyncThunk("cart/fetchCities", async () => {
    const response = await provinceApi.get(
        "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1"
    );
    return response.data;
});

// get districts
export const fetchDistricts = createAsyncThunk(
    "cart/fetchDistricts",
    async (code) => {
        const response = await provinceApi.get(`/p/${code}?depth=2`);
        return response.data.districts;
    }
);

// get districts
export const fetchWards = createAsyncThunk("cart/fetchWards", async (code) => {
    const response = await provinceApi.get(`/d/${code}?depth=2`);
    return response.data.wards;
});

// create order
export const createOrder = createAsyncThunk(
    "cart/createOrder",
    async ({ cart, id, address, totalPrice, voucherCode, note }) => {
        // create items object
        const items = cart.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
        }));

        // post api create order
        const response = await api.post("/order/", {
            user: id,
            address,
            items,
            totalPrice,
            voucherCode,
            note,
        });
        return response.data;
    }
);

export const {
    addToCart,
    setAddress,
    handleVoucherOnChange,
    setFullAddress,
    updateQuantity,
    clearAddress,
    clearCartState,
} = cartSlice.actions;
