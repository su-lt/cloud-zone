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
import { useDebounce } from "../../../helpers/ultil";

const Category = () => {
    const dispatch = useDispatch();
    const {
        categories,
        totalPages,
        createCompleted,
        updateCompleted,
        deleteCompleted,
        error,
    } = useSelector((slice) => slice.category);
    const { searchString } = useSelector((slice) => slice.filter);
    // use custom hook
    const debounceSearch = useDebounce(searchString);

    const [page, setPage] = useState(1);
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

    // search products
    useEffect(() => {
        dispatch(fetchCategories({ searchString: debounceSearch }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceSearch]);

    // fetch products
    useEffect(() => {
        dispatch(fetchCategories({ searchString, page }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

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

export default Category;
