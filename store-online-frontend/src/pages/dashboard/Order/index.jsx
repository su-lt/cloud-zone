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

const Users = () => {
    const dispatch = useDispatch();
    const { users, createCompleted, updateCompleted, deleteCompleted, error } =
        useSelector((slice) => slice.user);

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
            dispatch(fetchUsers());
            dispatch(setCreateCompleted());
        }

        if (updateCompleted) {
            toast.success("Update user successfully !");
            dispatch(fetchUsers());
            dispatch(setUpdateCompleted());
        }

        if (deleteCompleted) {
            toast.success("Delete user successfully !");
            dispatch(fetchUsers());
            dispatch(setDeleteCompleted());
        }

        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, updateCompleted, deleteCompleted, error]);

    useEffect(() => {
        dispatch(fetchUsers());
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
                    User management
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
                                                    : "bg-red-100 text-red-600"
                                            }
                                        `}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="text-right px-6 whitespace-nowrap">
                                    <button
                                        onClick={() => handleUpdate(user)}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        disabled={
                                            user.status === "inactive"
                                                ? true
                                                : false
                                        }
                                        onClick={() => handledDelete(user)}
                                        className={`py-2 leading-none px-3 font-medium duration-150 hover:bg-gray-50 rounded-lg ${
                                            user.status === "inactive"
                                                ? "text-gray-600 hover:text-gray-500"
                                                : "text-red-600 hover:text-red-500"
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

export default Users;
