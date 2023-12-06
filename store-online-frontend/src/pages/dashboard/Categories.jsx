import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/product.slice";
import CategoryModal from "../../components/Dashboard/CategoryMadal";

const Categories = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((slice) => slice.product);

    let [isOpen, setIsOpen] = useState(false);
    let [isUpdate, setIsUpdate] = useState(true);
    let [categoryId, setCategoryId] = useState("");

    const handleCreate = () => {
        setIsOpen(true);
        setIsUpdate(false);
        setCategoryId("");
    };

    const handleUpdate = (id) => {
        setIsOpen(true);
        setIsUpdate(true);
        setCategoryId(id);
    };

    useEffect(() => {
        dispatch(fetchCategories());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="px-4 mt-3 relative">
            {/* modal */}
            <CategoryModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                update={isUpdate}
                id={categoryId}
            />

            <div className="mt-3 items-start justify-between flex flex-col gap-3 md:flex-row">
                <div className="text-lg md:text-2xl text-gray-700 font-medium">
                    Category management
                </div>
                <button
                    onClick={handleCreate}
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
                                        onClick={() => handleUpdate(item._id)}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">
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

export default Categories;
