import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../redux/slices/order.slice";

const recentData = [
    {
        id: "1",
        product_id: "123",
        customer_id: "234",
        customer_name: "John Smith",
        order_date: "2023-05-12",
        order_total: "123",
        order_status: "Completed",
        shipping_address: "01 Nguyen Hue",
    },
    {
        id: "2",
        product_id: "123",
        customer_id: "234",
        customer_name: "John Smith",
        order_date: "2023-05-12",
        order_total: "123",
        order_status: "Completed",
        shipping_address: "01 Nguyen Hue",
    },
    {
        id: "3",
        product_id: "123",
        customer_id: "234",
        customer_name: "John Smith",
        order_date: "2023-05-12",
        order_total: "123",
        order_status: "open",
        shipping_address: "01 Nguyen Hue",
    },
    {
        id: "4",
        product_id: "123",
        customer_id: "234",
        customer_name: "John Smith",
        order_date: "2023-05-12",
        order_total: "123",
        order_status: "cancel",
        shipping_address: "01 Nguyen Hue",
    },
];

const RecentOrders = () => {
    const dispatch = useDispatch();
    // states redux
    const { orders } = useSelector((slice) => slice.order);

    useEffect(() => {
        dispatch(fetchOrders({ limit: 10 }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="p-4 pt-3 min-w-[265px] bg-white rounded-sm border-gray-200 flex-1">
            <strong className="text-gray-700 font-medium">Recent Orders</strong>
            <div className="mt-3 h-max overflow-x-auto">
                <table className="w-full table-auto text-gray-700 border-x border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 text-left">#</th>
                            <th className="py-3 px-6 text-left">OrderCode</th>
                            <th className="py-3 px-6 text-left">Customer</th>
                            <th className="py-3 px-6 text-left">
                                Shipping Address
                            </th>
                            <th className="py-3 px-6 text-left">Order Date</th>
                            <th className="py-3 px-6 text-left">
                                Order Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((order, index) => (
                            <tr key={order._id}>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    #{order.code}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    {order.user.fullname}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    {order.address}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <span
                                        className={`px-2 rounded-lg
                                            ${
                                                order.status === "pending"
                                                    ? "bg-gray-300 text-gray-600"
                                                    : order.status ===
                                                      "processing"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : order.status ===
                                                      "shipping"
                                                    ? "bg-purple-100 text-purple-600"
                                                    : order.status ===
                                                      "delivered"
                                                    ? "bg-green-100 text-green-600"
                                                    : order.status === "cancel"
                                                    ? "bg-red-100 text-red-600"
                                                    : "text-black"
                                            }
                                        `}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
