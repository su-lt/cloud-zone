import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout = () => {
    return (
        <main className="min-h-screen flex flex-col dark:bg-dark dark:text-purple-200">
            {/* header */}
            <Header />
            {/* content */}
            <Outlet />
            {/* footer */}
            <Footer />
        </main>
    );
};

export default DashboardLayout;
