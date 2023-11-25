import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/products", element: <Products /> },
    { path: "/products/:productId", element: <ProductDetail /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
];

export default routes;
