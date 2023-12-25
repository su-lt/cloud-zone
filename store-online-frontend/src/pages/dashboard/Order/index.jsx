import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpdateOder from "./UpdateOder";
import DeleteOrder from "./DeleteOrder";
import { toast } from "react-toastify";
import {
    fetchOrderById,
    fetchOrders,
    setDeleteObject,
    setUpdateCompleted,
    setDeleteCompleted,
    setError,
} from "../../../redux/slices/order.slice";
import { useDebounce } from "../../../helpers/ultil";
import Datepicker from "react-tailwindcss-datepicker";

const Orders = () => {
    const dispatch = useDispatch();
    // states redux
    const { orders, totalPages, updateCompleted, deleteCompleted, error } =
        useSelector((slice) => slice.order);
    const { searchString } = useSelector((slice) => slice.filter);
    // use custom hook
    const debounceSearch = useDebounce(searchString);

    const [page, setPage] = useState(1);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    // filter state
    // datetime picker value
    const [date, setDate] = useState({
        startDate: null,
        endDate: null,
    });
    // status
    const [status, setStatus] = useState("");

    const handleUpdate = (id) => {
        dispatch(fetchOrderById(id));
        setIsOpenUpdate(true);
    };

    const handledDelete = (order) => {
        dispatch(setDeleteObject({ id: order._id, code: order.code }));
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

    // search orders
    useEffect(() => {
        dispatch(fetchOrders({ searchString: debounceSearch }));
        setStatus("");
        setDate({
            startDate: null,
            endDate: null,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceSearch]);

    // fetch orders
    useEffect(() => {
        dispatch(
            fetchOrders({
                searchString,
                status,
                startDate: date.startDate,
                endDate: date.endDate,
                page,
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, status, date]);

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
            {/* filter */}
            <div className="mt-3 flex flex-col md:flex-row gap-2">
                <div>
                    <select
                        className="p-2 min-w-[120px] border text-custom-1000 rounded-md"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                    >
                        <option value="">All status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancel">Cancel</option>
                    </select>
                </div>
                <div className="">
                    <Datepicker
                        inputClassName="p-2 w-full md:w-[280px] rounded-md border text-custom-1000"
                        value={date}
                        onChange={setDate}
                        useRange={false}
                        displayFormat={"DD/MM/YYYY"}
                        maxDate={new Date()}
                    />
                </div>
            </div>
            <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-2">#</th>
                            <th className="py-3 px-2">OrderCode</th>
                            <th className="py-3 px-6">User</th>
                            <th className="py-3 px-6">Address Shipping</th>
                            <th className="py-3 px-6">Total Price</th>
                            <th className="py-3 px-2">Order Date</th>
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
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <div>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-GB")}
                                    </div>
                                    <div>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleTimeString()}
                                    </div>
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
                                        disabled={
                                            order.status === "delivered" ||
                                            order.status === "cancel"
                                                ? true
                                                : false
                                        }
                                        onClick={() => handleUpdate(order._id)}
                                        className={`py-2 px-3 font-medium  duration-150 hover:bg-gray-50 rounded-lg ${
                                            order.status === "delivered" ||
                                            order.status === "cancel"
                                                ? "text-gray-500"
                                                : "text-indigo-600 hover:text-indigo-500"
                                        }`}
                                    >
                                        Detail
                                    </button>
                                    <button
                                        disabled={
                                            order.status === "delivered" ||
                                            order.status === "cancel"
                                                ? true
                                                : false
                                        }
                                        onClick={() => handledDelete(order)}
                                        className={`py-2 leading-none px-3 font-medium  duration-150 rounded-lg ${
                                            order.status === "delivered" ||
                                            order.status === "cancel"
                                                ? "text-gray-500"
                                                : "text-red-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* pagination */}
                {totalPages > 0 && (
                    <div className="grid-cols-none w-full mx-auto mt-2 px-4 text-gray-600 md:px-8">
                        <div
                            className="flex items-center justify-center gap-x-3"
                            aria-label="Pagination"
                        >
                            <button
                                onClick={() => setPage(page - 1)}
                                className="hover:text-indigo-600  flex items-center gap-x-2"
                                disabled={page === 1 ? true : false}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <ul className="flex items-center gap-1">
                                {Array(totalPages)
                                    .fill(null)
                                    .map((_, idx) => (
                                        <li key={idx} className="text-sm">
                                            <button
                                                onClick={() => setPage(idx + 1)}
                                                className={`px-4 py-2 rounded-lg duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${
                                                    page === idx + 1
                                                        ? "bg-indigo-50 text-indigo-600 font-medium"
                                                        : ""
                                                }`}
                                                disabled={
                                                    page === idx + 1
                                                        ? true
                                                        : false
                                                }
                                            >
                                                {idx + 1}
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                            <button
                                onClick={() => setPage(page + 1)}
                                className="hover:text-indigo-600 flex items-center gap-x-2"
                                disabled={page === totalPages ? true : false}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
