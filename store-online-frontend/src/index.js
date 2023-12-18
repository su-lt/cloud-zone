import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { checkAuth } from "./redux/slices/auth.slice";
import { cartSlice } from "./redux/slices/cart.slice";
const root = ReactDOM.createRoot(document.getElementById("root"));

// check user ready login
const existedUserId = localStorage.getItem("id");
if (existedUserId) store.dispatch(checkAuth());

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
