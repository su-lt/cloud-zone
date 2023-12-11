import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { authSlice } from "./redux/slices/auth.slice";
import { cartSlice } from "./redux/slices/cart.slice";
const root = ReactDOM.createRoot(document.getElementById("root"));

// check user ready login
const existUser = localStorage.getItem("username");
if (existUser) store.dispatch(authSlice.actions.setCurrentUser(existUser));

// check cart store
const existCart = localStorage.getItem("cart");
if (existCart)
    store.dispatch(cartSlice.actions.loadCart(JSON.parse(existCart)));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
                <ToastContainer />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
