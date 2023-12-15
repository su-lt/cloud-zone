import { Route, Routes } from "react-router-dom";
import { routes_main, routes_dashboard } from "./routes";

import DashboardLayout from "./pages/dashboard/Layout";
import MainLayout from "./pages/main/Layout";

function App() {
    return (
        <>
            {/* routes */}
            <Routes>
                {/* main */}
                <Route path="/" element={<MainLayout />}>
                    {routes_main.map((page, idx) => {
                        return (
                            <Route
                                path={page.path}
                                element={page.element}
                                key={idx}
                            />
                        );
                    })}
                </Route>
                {/* dashboard */}
                <Route path="/admin" element={<DashboardLayout />}>
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
        </>
    );
}

export default App;
