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
import { checkRole, toggleDarkMode } from "./redux/slices/auth.slice";
import { cartSlice } from "./redux/slices/cart.slice";
const root = ReactDOM.createRoot(document.getElementById("root"));

// check user ready login
const existedUserId = localStorage.getItem("id");
if (existedUserId) store.dispatch(checkRole());

// check cart store
const existCart = localStorage.getItem("cart");
if (existCart)
    store.dispatch(cartSlice.actions.loadCart(JSON.parse(existCart)));

// check darkmode
const darkMode = localStorage.getItem("darkMode");
if (darkMode === "true") store.dispatch(toggleDarkMode());

window.addEventListener("storage", (event) => {
    if (event.key === "logoutSignal" || event.key === "loginSignal") {
        // if logout was successful
        // refresh all tab
        window.location.reload();
    }
});

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
                <ToastContainer autoClose={2000} />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
