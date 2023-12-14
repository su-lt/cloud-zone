import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";
import { toast } from "react-toastify";
import {
    fetchProducts,
    setCreateCompleted,
    setDeleteCompleted,
    setUpdateCompleted,
    setError,
    fetchProductById,
    setDeleteObject,
} from "../../../redux/slices/product.slice";
import { fetchCategories } from "../../../redux/slices/category.slice";
import noImage from "../../../assets/images/no-image.png";

const Orders = () => {
    const dispatch = useDispatch();

    const {
        products,
        createCompleted,
        updateCompleted,
        deleteCompleted,
        error,
    } = useSelector((slice) => slice.product);

    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const handleUpdate = (id) => {
        dispatch(fetchProductById(id));
        setIsOpenUpdate(true);
    };

    const handleDelete = (id, name) => {
        dispatch(setDeleteObject({ id, name }));
        setIsOpenDelete(true);
    };

    useEffect(() => {
        if (createCompleted) {
            toast.success("Create new product successfully !");
            dispatch(fetchProducts({ defaultConfig: false }));
            dispatch(setCreateCompleted());
        }

        if (updateCompleted) {
            toast.success("Update product successfully !");
            dispatch(fetchProducts({ defaultConfig: false }));
            dispatch(setUpdateCompleted());
        }

        if (deleteCompleted) {
            toast.success("Delete product successfully !");
            dispatch(fetchProducts({ defaultConfig: false }));
            dispatch(setDeleteCompleted());
        }

        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, updateCompleted, deleteCompleted, error]);

    useEffect(() => {
        dispatch(fetchProducts({ defaultConfig: false }));
        dispatch(fetchCategories());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="px-4 mt-3">
            {/* create modal */}
            <CreateProduct
                isOpen={isOpenCreate}
                onClose={() => setIsOpenCreate(false)}
            />
            {/* update modal */}
            <UpdateProduct
                isOpen={isOpenUpdate}
                onClose={() => setIsOpenUpdate(false)}
            />
            {/* delete modal */}
            <DeleteProduct
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
            />
            <div className="mt-3 items-start justify-between flex flex-col gap-3 md:flex-row">
                <div className="text-lg md:text-2xl text-gray-700 font-medium">
                    Products management
                </div>
                <button
                    onClick={() => setIsOpenCreate(true)}
                    className="px-4 py-2 text-sm text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-md"
                >
                    Create Product
                </button>
            </div>
            <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-2">#</th>
                            <th className="py-3 px-6">Name</th>
                            <th className="py-3 px-3">Thumbnail</th>
                            <th className="py-3 px-2">Price</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {products.length === 0 ? (
                            <tr className="text-center">
                                <td>No product, please check it again !</td>
                            </tr>
                        ) : null}
                        {products.map((item, index) => (
                            <tr key={item._id}>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    {index + 1}
                                </td>
                                <td className="w-full px-6 py-4 whitespace-nowrap">
                                    {item.name}
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                    <img
                                        src={`${
                                            item.image_thumbnail || noImage
                                        }`}
                                        alt=""
                                        className="h-16 w-auto object-cover"
                                    />
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    $ {item.price}
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <span
                                        className={`${
                                            item.status === "active"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                        } px-2 rounded-lg`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="text-right px-6 whitespace-nowrap">
                                    <button
                                        onClick={() => handleUpdate(item._id)}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(item._id, item.name)
                                        }
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

export default Orders;
