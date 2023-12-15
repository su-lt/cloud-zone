import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout = () => {
    return (
        <main>
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
