import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineAdjustments,
} from "react-icons/hi";

import Category from "./Categories";
import Products from "./Products";
import Orders from "./Orders";
import Dashboard from "./Dashboard";

export const DASHBOARD_SIDEBAR = [
    {
        key: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <HiOutlineViewGrid size={32} />,
        element: <Dashboard />,
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
        element: <Products />,
    },
    {
        key: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <HiOutlineShoppingCart size={32} />,
        element: <Orders />,
    },
];
