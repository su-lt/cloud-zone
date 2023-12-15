import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import DeleteCategory from "./DeleteCategory";
import {
    setCreateCompleted,
    setDeleteCompleted,
    setUpdateCompleted,
    setError,
} from "../../../redux/slices/category.slice";
import { toast } from "react-toastify";

import {
    fetchCategories,
    setDeleteObject,
    setUpdateObject,
    totalProductByCategoryId,
} from "../../../redux/slices/category.slice";

const Category = () => {
    const dispatch = useDispatch();
    const {
        categories,
        createCompleted,
        updateCompleted,
        deleteCompleted,
        error,
    } = useSelector((slice) => slice.category);

    // state to open/close modal
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    // handle update click
    const handleUpdate = (category) => {
        dispatch(setUpdateObject(category));
        setIsOpenUpdate(true);
    };

    // handle delete click
    const handledDelete = (category) => {
        dispatch(setDeleteObject(category));
        dispatch(totalProductByCategoryId(category._id));
        setIsOpenDelete(true);
    };

    useEffect(() => {
        // create completed
        if (createCompleted) {
            toast.success("Create new category successfully!");
            dispatch(fetchCategories());
            dispatch(setCreateCompleted());
        }

        // update completed
        if (updateCompleted) {
            toast.success("Update category successfully !");
            dispatch(fetchCategories());
            dispatch(setUpdateCompleted());
        }

        // delete completed
        if (deleteCompleted) {
            toast.success("Delete category successfully !");
            dispatch(fetchCategories());
            dispatch(setDeleteCompleted());
        }

        // get error
        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, updateCompleted, deleteCompleted, error]);

    useEffect(() => {
        dispatch(fetchCategories());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="px-4 mt-3">
            {/* create modal */}
            <CreateCategory
                isOpen={isOpenCreate}
                onClose={() => setIsOpenCreate(false)}
            />
            <UpdateCategory
                isOpen={isOpenUpdate}
                onClose={() => setIsOpenUpdate(false)}
            />
            <DeleteCategory
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
            />
            <div className="mt-3 items-start justify-between flex flex-col gap-3 md:flex-row">
                <div className="text-lg md:text-2xl text-gray-700 font-medium">
                    Categories management
                </div>
                <button
                    onClick={() => setIsOpenCreate(true)}
                    className="px-4 py-2 text-sm text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-md"
                >
                    Create Category
                </button>
            </div>
            <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">Name</th>
                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {categories.map((item) => (
                            <tr key={item._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.name}
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
            </div>
        </div>
    );
};

export default Category;
