import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth.slice";
import { productSlice } from "./slices/product.slice";
import { filterSlice } from "./slices/filter.slice";
import { cartSlice } from "./slices/cart.slice";
import { categorySlice } from "./slices/category.slice";
import { userSlice } from "./slices/user.slice";
import { orderSlice } from "./slices/order.slice";
import { profileSlice } from "./slices/profile.slice";
import { voucherSlice } from "./slices/voucher.slice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        user: userSlice.reducer,
        profile: profileSlice.reducer,
        product: productSlice.reducer,
        filter: filterSlice.reducer,
        cart: cartSlice.reducer,
        category: categorySlice.reducer,
        order: orderSlice.reducer,
        voucher: voucherSlice.reducer,
    },
});
