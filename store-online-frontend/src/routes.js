import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineAdjustments,
    HiOutlineUsers,
} from "react-icons/hi";
// main pages
import HomePage from "./pages/main/HomePage";
import RegisterPage from "./pages/main/Register";
import LoginPage from "./pages/main/Login";
import Products from "./pages/main/Products";
import ProductDetail from "./pages/main/ProductDetail";
import Cart from "./pages/main/Cart";
import NotFound from "./pages/main/404";
import Contact from "./pages/main/Contact";
// dashboard pages
import Dashboard from "./pages/dashboard/";
import User from "./pages/dashboard/User";
import Category from "./pages/dashboard/Category";
import Product from "./pages/dashboard/Product";
import Order from "./pages/dashboard/Order";

const routes_main = [
    { path: "/", element: <HomePage /> },
    { path: "/products", element: <Products /> },
    { path: "/products/:slug", element: <ProductDetail /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/cart", element: <Cart /> },
    { path: "/contact", element: <Contact /> },
    { path: "*", element: <NotFound /> },
];

const routes_dashboard = [
    {
        key: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <HiOutlineViewGrid size={32} />,
        element: <Dashboard />,
    },
    {
        key: "users",
        label: "Users",
        path: "/admin/users",
        icon: <HiOutlineUsers size={32} />,
        element: <User />,
    },
    {
        key: "categories",
        label: "Categories",
        path: "/admin/categories",
        icon: <HiOutlineAdjustments size={32} />,
        element: <Category />,
    },
    {
        key: "products",
        label: "Products",
        path: "/admin/products",
        icon: <HiOutlineCube size={32} />,
        element: <Product />,
    },
    {
        key: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <HiOutlineShoppingCart size={32} />,
        element: <Order />,
    },
];

export { routes_main, routes_dashboard };
