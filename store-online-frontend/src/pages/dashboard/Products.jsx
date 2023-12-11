import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    setError,
    setCreateCompleted,
    setUpdateCompleted,
    fetchProductById,
    setDeleteObject,
} from "../../redux/slices/product.slice";
import ProductModal from "../../components/Dashboard/ProductMadal";
import { toast } from "react-toastify";
import noImage from "../../assets/images/no-image.png";

const Products = () => {
    const dispatch = useDispatch();
    const {
        products,
        createCompleted,
        updateCompleted,
        deleteCompleted,
        error,
    } = useSelector((slice) => slice.product);

    let [isOpen, setIsOpen] = useState(false);
    let [isUpdate, setIsUpdate] = useState(false);
    let [isDelete, setDelete] = useState(false);

    const handleCreate = () => {
        setIsOpen(true);
        setIsUpdate(false);
        setDelete(false);
    };

    const handleUpdate = (_id) => {
        dispatch(fetchProductById(_id));
        setIsOpen(true);
        setIsUpdate(true);
        setDelete(false);
    };

    const handleDelete = (_id, name) => {
        dispatch(setDeleteObject({ id: _id, name }));
        setIsOpen(true);
        setIsUpdate(false);
        setDelete(true);
    };

    useEffect(() => {
        if (createCompleted) {
            toast.success("Create new product successfully !");
            dispatch(setCreateCompleted());
            dispatch(fetchProducts({ defaultConfig: false }));
        }

        if (updateCompleted) {
            toast.success("Update product successfully !");
            dispatch(setUpdateCompleted());
            dispatch(fetchProducts({ defaultConfig: false }));
        }

        if (deleteCompleted) {
            toast.success("Delete product successfully !");
            dispatch(setUpdateCompleted());
            dispatch(fetchProducts({ defaultConfig: false }));
        }

        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, updateCompleted, deleteCompleted, error]);

    useEffect(() => {
        dispatch(fetchProducts({ defaultConfig: false }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="px-4 mt-3 relative">
            {/* modal */}
            <ProductModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                update={isUpdate}
                del={isDelete}
            />

            <div className="mt-3 items-start justify-between flex flex-col gap-3 md:flex-row">
                <div className="text-lg md:text-2xl text-gray-700 font-medium">
                    Product management
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 text-sm text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-md"
                >
                    Create Product
                </button>
            </div>
            <div className="mt-3 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">Name</th>
                            <th className="py-3 px-6">Thumbnail</th>
                            <th className="py-3 px-6">Price</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {products.length === 0 ? (
                            <tr className="text-center">
                                <td>No product, please check it again !</td>
                            </tr>
                        ) : null}
                        {products.map((item) => (
                            <tr key={item._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={`${
                                            item.image_thumbnail || noImage
                                        }`}
                                        alt=""
                                        className="h-16 w-auto object-cover"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    $ {item.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
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

export default Products;
