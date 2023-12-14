import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-x-auto bg-gray-100">
                <Header />
                <Outlet />
            </div>
        </main>
    );
};

export default DashboardLayout;
