import { Route, Routes, useLocation } from "react-router-dom";
import { routes_main, routes_dashboard } from "./routes";

import Footer from "./pages/Footer";
import Header from "./pages/Header";
// import LayoutSection from "./components/LayoutSection";
import DashboardLayout from "./pages/dashboard/Layout";
// import Dashboard from "./pages/dashboard/Dashboard";
// import Product from "./pages/dashboard/Product";
// import Category from "./pages/dashboard/Category";
// import Orders from "./pages/dashboard/Order";
// import Users from "./pages/dashboard/User";

function App() {
    const location = useLocation();
    const isAdminDashboard = location.pathname.includes("/admin");

    return (
        <>
            {/* header */}
            {!isAdminDashboard && <Header />}
            {/* layout amination appearing */}
            {/* <LayoutSection /> */}

            {/* routes */}
            <Routes>
                {routes_main.map((page, idx) => {
                    return (
                        <Route
                            path={page.path}
                            element={page.element}
                            key={idx}
                        />
                    );
                })}
                <Route path="/admin" element={<DashboardLayout />}>
                    {/* <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Product />} />
                    <Route path="categories" element={<Category />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="users" element={<Users />} /> */}
                    {routes_dashboard.map((page, idx) => {
                        return (
                            <Route
                                path={page.key}
                                element={page.element}
                                key={idx}
                            />
                        );
                    })}
                </Route>
            </Routes>
            {/* footer */}
            {!isAdminDashboard && <Footer />}
        </>
    );
}

export default App;
