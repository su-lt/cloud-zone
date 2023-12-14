import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpdateOder from "./UpdateOder";
import DeleteOrder from "./DeleteOrder";
import { toast } from "react-toastify";
import {
    fetchOrderById,
    fetchOrders,
    setDeleteCompleted,
    setUpdateCompleted,
    setError,
} from "../../../redux/slices/order.slice";

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, updateCompleted, deleteCompleted, error } = useSelector(
        (slice) => slice.order
    );

    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const handleUpdate = (id) => {
        dispatch(fetchOrderById(id));
        setIsOpenUpdate(true);
    };

    const handledDelete = (user) => {
        // dispatch(setDeleteOject(user));
        setIsOpenDelete(true);
    };

    useEffect(() => {
        if (updateCompleted) {
            toast.success("Update user successfully !");
            dispatch(fetchOrders());
            dispatch(setUpdateCompleted());
        }

        if (deleteCompleted) {
            toast.success("Delete user successfully !");
            dispatch(fetchOrders());
            dispatch(setDeleteCompleted());
        }

        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateCompleted, deleteCompleted, error]);

    useEffect(() => {
        dispatch(fetchOrders());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="px-4 mt-3">
            {/* create modal */}
            <UpdateOder
                isOpen={isOpenUpdate}
                onClose={() => setIsOpenUpdate(false)}
            />
            <DeleteOrder
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
            />
            <div className="mt-3 items-start justify-between flex flex-col gap-3 md:flex-row">
                <div className="text-lg md:text-2xl text-gray-700 font-medium">
                    Orders management
                </div>
            </div>
            <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-2">#</th>
                            <th className="py-3 px-2">OrderCode</th>
                            <th className="py-3 px-6">User</th>
                            <th className="py-3 px-6">Address shipping</th>
                            <th className="py-3 px-6">Total Price</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {orders.length === 0 ? (
                            <tr className="text-center">
                                <td>No order, please check it again !</td>
                            </tr>
                        ) : null}
                        {orders.map((order, idx) => (
                            <tr key={idx}>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    {idx + 1}
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    #{order.code}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {order.user.fullname}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {order.address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    ${order.totalPrice}
                                </td>
                                <td className={`px-2 py-4 whitespace-nowrap`}>
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
                                <td className="text-right px-2 whitespace-nowrap">
                                    <button
                                        onClick={() => handleUpdate(order._id)}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Detail
                                    </button>
                                    <button
                                        disabled={
                                            order.status === "cancel"
                                                ? true
                                                : false
                                        }
                                        onClick={() => handledDelete(order._id)}
                                        className={`py-2 leading-none px-3 font-medium  duration-150 rounded-lg ${
                                            order.status === "cancel"
                                                ? "text-gray-500"
                                                : "text-red-500 hover:bg-gray-50 "
                                        }`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
