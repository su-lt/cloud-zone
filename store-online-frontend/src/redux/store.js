import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth.slice";
import { productSlice } from "./slices/product.slice";
import { filterSlice } from "./slices/filter.slice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        product: productSlice.reducer,
        filter: filterSlice.reducer,
    },
});
