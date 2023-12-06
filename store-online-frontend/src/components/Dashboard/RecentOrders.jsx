import React from "react";

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
    return (
        <div className="p-4 pt-3 min-w-[265px] bg-white rounded-sm border-gray-200 flex-1">
            <strong className="text-gray-700 font-medium">Recent Orders</strong>
            <div className="mt-3 h-max overflow-x-auto">
                <table className="w-full table-auto text-gray-700 border-x border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-3 px-6">ID</th>
                            <th className="py-3 px-6">Product ID</th>
                            <th className="py-3 px-6">Customer Name</th>
                            <th className="py-3 px-6">Order Date</th>
                            <th className="py-3 px-6">Order Total</th>
                            <th className="py-3 px-6">Shipping Address</th>
                            <th className="py-3 px-6">Order Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {recentData.map((order) => (
                            <tr key={order.id}>
                                <td className="pr-6 py-4 whitespace-nowrap">
                                    #{order.id}
                                </td>
                                <td className="pr-6 py-4 whitespace-nowrap">
                                    {order.product_id}
                                </td>
                                <td className="pr-6 py-4 whitespace-nowrap">
                                    {order.customer_name}
                                </td>
                                <td className="pr-6 py-4 whitespace-nowrap">
                                    {new Date(
                                        order.order_date
                                    ).toLocaleDateString()}
                                </td>
                                <td className="pr-6 py-4 whitespace-nowrap">
                                    {order.order_total}
                                </td>
                                <td className="pr-6 py-4 whitespace-nowrap">
                                    {order.shipping_address}
                                </td>
                                <td className="pr-6 py-4 whitespace-nowrap">
                                    {order.order_status}
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
