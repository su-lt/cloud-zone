import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../helpers/axiosApi";

const initialState = {
    cart: [],
    totalQuantity: 0,
    totalPrice: 0,
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
        clearState: (state) => {
            state = initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductById.fulfilled, (state, { payload }) => {
            const foundIndex = state.cart.findIndex(
                (item) => item._id === payload._id
            );
            // if product found, increase quantity
            if (foundIndex !== -1) {
                state.cart[foundIndex].name = payload.name;
                state.cart[foundIndex].image_thumbnail =
                    payload.image_thumbnail;
            }
        });
    },
});

// get product by id
export const fetchProductById = createAsyncThunk(
    "cart/fetchProductById",
    async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data.metadata.product;
    }
);

export const { addToCart } = cartSlice.actions;
