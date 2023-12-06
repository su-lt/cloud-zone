import { IoBagHandle, IoPieChart, IoPeople, IoCart } from "react-icons/io5";

const StatsGrid = () => {
    return (
        <div className="p-4 pt-3 rounded-sm border-gray-200">
            <strong className="px-4 text-gray-700 font-medium">
                Overviews
            </strong>
            <div className="pt-3 grid sm:grid-cols-2 min-[1300px]:grid-cols-4 gap-4">
                <BoxWrapper>
                    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
                        <IoBagHandle className="text-2xl text-white" />
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-500 font-sans">
                            Total Sales
                        </span>
                        <div className="flex items-center">
                            <strong className="text-xl text-gray-700 font-semibold">
                                $3456.78
                            </strong>
                            <span className="text-sm text-green-500 pl-2">
                                +234
                            </span>
                        </div>
                    </div>
                </BoxWrapper>
                <BoxWrapper>
                    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                        <IoPieChart className="text-2xl text-white" />
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-500 font-sans">
                            Total Expenses
                        </span>
                        <div className="flex items-center">
                            <strong className="text-xl text-gray-700 font-semibold">
                                $3456.78
                            </strong>
                            <span className="text-sm text-green-500 pl-2">
                                +234
                            </span>
                        </div>
                    </div>
                </BoxWrapper>
                <BoxWrapper>
                    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
                        <IoPeople className="text-2xl text-white" />
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-500 font-sans">
                            Total Customers
                        </span>
                        <div className="flex items-center">
                            <strong className="text-xl text-gray-700 font-semibold">
                                $3456.78
                            </strong>
                            <span className="text-sm text-green-500 pl-2">
                                +234
                            </span>
                        </div>
                    </div>
                </BoxWrapper>
                <BoxWrapper>
                    <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
                        <IoCart className="text-2xl text-white" />
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-500 font-sans">
                            Total Orders
                        </span>
                        <div className="flex items-center">
                            <strong className="text-xl text-gray-700 font-semibold">
                                $3456.78
                            </strong>
                            <span className="text-sm text-green-500 pl-2">
                                +234
                            </span>
                        </div>
                    </div>
                </BoxWrapper>
            </div>
        </div>
    );
};

export default StatsGrid;

const BoxWrapper = ({ children }) => {
    return (
        <div className="bg-white rounded-sm p-4 border border-gray-200 flex items-center">
            {children}
        </div>
    );
};
