import PopularProducts from "../../components/Dashboard/PopularProducts";
import RecentOrders from "../../components/Dashboard/RecentOrders";
import StatsGrid from "../../components/Dashboard/StatsGrid";

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-4">
            <StatsGrid />
            <div className="p-4 w-full flex flex-col gap-4 min-[1300px]:flex-row">
                <RecentOrders />
                <PopularProducts />
            </div>
        </div>
    );
};

export default Dashboard;
