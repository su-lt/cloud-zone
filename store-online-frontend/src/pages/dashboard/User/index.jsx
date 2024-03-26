import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";
import {
    fetchRoles,
    fetchUsers,
    setCreateCompleted,
    setDeleteCompleted,
    setDeleteOject,
    setError,
    setUpdateCompleted,
    setUserUpdate,
} from "../../../redux/slices/user.slice";
import { toast } from "react-toastify";
import { useDebounce } from "../../../helpers/ultil";

const Users = () => {
    const dispatch = useDispatch();
    // redux state
    const {
        users,
        totalPages,
        createCompleted,
        updateCompleted,
        deleteCompleted,
        error,
    } = useSelector((slice) => slice.user);
    const { searchString } = useSelector((slice) => slice.filter);
    // use custom hook
    const debounceSearch = useDebounce(searchString);

    const [page, setPage] = useState(1);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const handleUpdate = (user) => {
        dispatch(setUserUpdate(user));
        setIsOpenUpdate(true);
    };

    const handledDelete = (user) => {
        dispatch(setDeleteOject(user));
        setIsOpenDelete(true);
    };

    useEffect(() => {
        if (createCompleted) {
            toast.success("Create new user successfully !");
            dispatch(fetchUsers({}));
            dispatch(setCreateCompleted());
        }

        if (updateCompleted) {
            toast.success("Update user successfully !");
            dispatch(fetchUsers({}));
            dispatch(setUpdateCompleted());
        }

        if (deleteCompleted) {
            toast.success("Delete user successfully !");
            dispatch(fetchUsers({}));
            dispatch(setDeleteCompleted());
        }

        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, updateCompleted, deleteCompleted, error]);

    // search products
    useEffect(() => {
        dispatch(fetchUsers({ searchString: debounceSearch }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceSearch]);

    // fetch products
    useEffect(() => {
        dispatch(fetchUsers({ searchString, page }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        dispatch(fetchRoles());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="px-4 mt-3">
            {/* create modal */}
            <CreateUser
                isOpen={isOpenCreate}
                onClose={() => setIsOpenCreate(false)}
            />
            <UpdateUser
                isOpen={isOpenUpdate}
                onClose={() => setIsOpenUpdate(false)}
            />
            <DeleteUser
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
            />
            <div className="mt-3 items-start justify-between flex flex-col gap-3 md:flex-row">
                <div className="text-lg md:text-2xl text-gray-700 font-medium">
                    Users management
                </div>
                <button
                    onClick={() => setIsOpenCreate(true)}
                    className="px-4 py-2 text-sm text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-md"
                >
                    Create User
                </button>
            </div>
            <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">#</th>
                            <th className="py-3 px-6">Fullname</th>
                            <th className="py-3 px-6">Email</th>
                            <th className="py-3 px-6">Address</th>
                            <th className="py-3 px-6">Role</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {users.length === 0 ? (
                            <tr className="text-center">
                                <td>No user, please check it again !</td>
                            </tr>
                        ) : null}
                        {users.map((user, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {idx + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.fullname}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.role.name}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap`}>
                                    <span
                                        className={`px-2 rounded-lg
                                            ${
                                                user.status === "active"
                                                    ? "bg-green-100 text-green-600"
                                                    : user.status === "deleted"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-gray-300 text-gray-600"
                                            }
                                        `}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="text-right px-6 whitespace-nowrap">
                                    <button
                                        disabled={
                                            user.status === "deleted"
                                                ? true
                                                : false
                                        }
                                        onClick={() => handleUpdate(user)}
                                        className={`py-2 px-3 font-medium duration-150 hover:bg-gray-50 rounded-lg ${
                                            user.status === "deleted"
                                                ? "text-gray-600 hover:text-gray-500"
                                                : "text-indigo-600 hover:text-indigo-500"
                                        }`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        disabled={
                                            user.status === "active"
                                                ? false
                                                : true
                                        }
                                        onClick={() => handledDelete(user)}
                                        className={`py-2 leading-none px-3 font-medium duration-150 hover:bg-gray-50 rounded-lg ${
                                            user.status === "active"
                                                ? "text-red-600 hover:text-red-500"
                                                : "text-gray-600 hover:text-gray-500"
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

export default Users;
