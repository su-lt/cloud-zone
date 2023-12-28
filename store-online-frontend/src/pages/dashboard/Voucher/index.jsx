import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateVoucher from "./CreateVoucher";
import UpdateVoucher from "./UpdateVoucher";
import DeleteVouchery from "./DeleteVoucher";
import { toast } from "react-toastify";
import {
    fetchVouchers,
    setDeleteObject,
    setUpdateObject,
    setCreateCompleted,
    setDeleteCompleted,
    setUpdateCompleted,
    clearState,
} from "../../../redux/slices/voucher.slice";
import { useDebounce } from "../../../helpers/ultil";

const Voucher = () => {
    const dispatch = useDispatch();
    const {
        vouchers,
        totalPages,
        createCompleted,
        updateCompleted,
        deleteCompleted,
        error,
        setError,
    } = useSelector((slice) => slice.voucher);
    const { searchString } = useSelector((slice) => slice.filter);
    // use custom hook
    const debounceSearch = useDebounce(searchString);

    const [page, setPage] = useState(1);
    // state to open/close modal
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    // handle update click
    const handleUpdate = (voucher) => {
        dispatch(setUpdateObject(voucher));
        setIsOpenUpdate(true);
    };

    // handle delete click
    const handledDelete = (voucher) => {
        dispatch(setDeleteObject(voucher));
        setIsOpenDelete(true);
    };

    useEffect(() => {
        // create completed
        if (createCompleted) {
            toast.success("Create new voucher successfully!");
            dispatch(fetchVouchers({}));
            dispatch(setCreateCompleted());
        }

        // update completed
        if (updateCompleted) {
            toast.success("Update voucher successfully !");
            dispatch(fetchVouchers({}));
            dispatch(setUpdateCompleted());
        }

        // delete completed
        if (deleteCompleted) {
            toast.success("Delete voucher successfully !");
            dispatch(fetchVouchers({}));
            dispatch(setDeleteCompleted());
        }

        // get error
        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
            dispatch(clearState());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, updateCompleted, deleteCompleted, error]);

    // search products
    useEffect(() => {
        dispatch(fetchVouchers({ searchString: debounceSearch }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceSearch]);

    // fetch products
    useEffect(() => {
        dispatch(fetchVouchers({ searchString, page }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <div className="px-4 mt-3">
            {/* create modal */}
            <CreateVoucher
                isOpen={isOpenCreate}
                onClose={() => setIsOpenCreate(false)}
            />
            <UpdateVoucher
                isOpen={isOpenUpdate}
                onClose={() => setIsOpenUpdate(false)}
            />
            <DeleteVouchery
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
            />
            <div className="mt-3 items-start justify-between flex flex-col gap-3 md:flex-row">
                <div className="text-lg md:text-2xl text-gray-700 font-medium">
                    Vouchers management
                </div>
                <button
                    onClick={() => setIsOpenCreate(true)}
                    className="px-4 py-2 text-sm text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-md"
                >
                    Create voucher
                </button>
            </div>
            <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-2">#</th>
                            <th className="py-3 px-3">Code</th>
                            <th className="py-3 px-3">Percent discount</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {vouchers.length === 0 && (
                            <tr className="text-center">
                                <td>No voucher, please check it again !</td>
                            </tr>
                        )}
                        {vouchers.map((item, index) => (
                            <tr key={item._id}>
                                <td className="px-3 py-4 whitespace-nowrap">
                                    {index + 1}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                    #{item.code}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                    {item.discount}%
                                </td>
                                <td className={`px-3 py-4 whitespace-nowrap`}>
                                    <span
                                        className={`px-2 rounded-lg
                                            ${
                                                item.status === "available"
                                                    ? "bg-green-100 text-green-600"
                                                    : item.status === "used"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-gray-300 text-gray-600"
                                            }
                                        `}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="text-right px-6 whitespace-nowrap">
                                    <button
                                        onClick={() => handleUpdate(item)}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handledDelete(item)}
                                        className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
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

export default Voucher;
