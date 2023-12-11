import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/category.slice";
import {
    setProductObject,
    setUpdateObject,
    createProduct,
    updateProduct,
    clearState,
    deleteProduct,
} from "../../redux/slices/product.slice";

const colors = [
    { bg: "bg-[#2563EB]", ring: "ring-[#2563EB]", value: "blue" },
    { bg: "bg-[#8B5CF6]", ring: "ring-[#8B5CF6]", value: "purple" },
    { bg: "bg-[#DB2777]", ring: "ring-[#DB2777]", value: "red" },
    { bg: "bg-[#475569]", ring: "ring-[#475569]", value: "gray" },
    { bg: "bg-[#EA580C]", ring: "ring-[#EA580C]", value: "orange" },
];

const CategoryModal = ({ isOpen, onClose, update, del }) => {
    const dispatch = useDispatch();

    const { categories } = useSelector((slice) => slice.category);
    const {
        productObject,
        updateObject,
        deleteObject,
        errors,
        pending,
        createCompleted,
        updateCompleted,
        deleteCompleted,
        error,
    } = useSelector((slice) => slice.product);
    const [images, setImages] = useState([]);
    const [errorUpload, setErrorUpload] = useState("");

    const handleInputChange = (field, value, isValid) => {
        if (update) dispatch(setUpdateObject({ field, value, isValid }));
        else dispatch(setProductObject({ field, value, isValid }));
    };

    const handleImageChange = async (event) => {
        const files = event.target.files;

        for (let file of files) {
            if (images.length + files.length > 4)
                setErrorUpload("Maximum upload 04 images !");
            else {
                file.preview = URL.createObjectURL(file);
                setImages((prev) => prev.concat(file));
                setErrorUpload("");
            }
        }
    };

    const removeImage = (image) => {
        setImages(images.filter((e) => e !== image));
        URL.revokeObjectURL(image.preview);
    };

    const handleClick = async () => {
        if (update) dispatch(updateProduct({ images }));
        else if (del) dispatch(deleteProduct(deleteObject.id));
        else dispatch(createProduct({ images }));
    };

    const handleClose = () => {
        images.length > 0 &&
            images.map((img) => URL.revokeObjectURL(img.preview));
        setImages([]);
        setErrorUpload("");
        dispatch(clearState());
        onClose();
    };

    useEffect(() => {
        if (createCompleted || updateCompleted || deleteCompleted || error) {
            handleClose();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, updateCompleted, deleteCompleted, error]);

    useEffect(() => {
        dispatch(fetchCategories());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={handleClose}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    </Transition.Child>

                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
                            {del ? (
                                <>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-red-600"
                                    >
                                        Delete
                                    </Dialog.Title>

                                    <div className="mt-2">
                                        <p className="mt-2">
                                            Do you sure to delete this category
                                            name:
                                            <span className="text-red-400">
                                                {deleteObject.name}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
                                            onClick={handleClick}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* header */}
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {update
                                            ? "Update Product"
                                            : "Add New Product"}
                                    </Dialog.Title>

                                    {/* body */}
                                    <div className="mt-4 text-gray-600">
                                        {/* name */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 border rounded-md ${
                                                        errors.name &&
                                                        "border-red-400"
                                                    }`}
                                                    value={
                                                        update
                                                            ? updateObject.name
                                                            : productObject.name
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.name && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* price */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium ">
                                                Price
                                            </label>
                                            <div className="flex-1">
                                                <div className="w-full relative border rounded-md">
                                                    <span className="absolute top-1/2 -translate-y-1/2 ml-2 pointer-events-none">
                                                        $
                                                    </span>
                                                    <input
                                                        type="number"
                                                        className={`block w-full border rounded-md py-2 pl-7 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 ${
                                                            errors.price &&
                                                            "border-red-400"
                                                        }`}
                                                        placeholder="0.00"
                                                        value={
                                                            update
                                                                ? updateObject.price
                                                                : productObject.price
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "price",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.price && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* category */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium">
                                                Category
                                            </label>
                                            <div className="flex-1">
                                                <div className="relative w-full">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3 pointer-events-none"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <select
                                                        value={
                                                            update
                                                                ? updateObject.category
                                                                : productObject.category
                                                        }
                                                        className={`px-3 py-2 w-full border rounded-md outline-none appearance-none focus:ring-1 focus:ring-inset focus:ring-indigo-600 ${
                                                            errors.category &&
                                                            "border-red-400"
                                                        }`}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "category",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="0">
                                                            Select category
                                                        </option>
                                                        {categories.map(
                                                            (item) => (
                                                                <option
                                                                    key={
                                                                        item._id
                                                                    }
                                                                    value={
                                                                        item._id
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                                {errors.category && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* quantity */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Quantity
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 border rounded-md ${
                                                        errors.quantity &&
                                                        "border-red-400"
                                                    }`}
                                                    value={
                                                        update
                                                            ? updateObject.quantity
                                                            : productObject.quantity
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.quantity && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.quantity}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* brand */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Brand
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 border rounded-md ${
                                                        errors.brand &&
                                                        "border-red-400"
                                                    }`}
                                                    value={
                                                        update
                                                            ? updateObject.brand
                                                            : productObject.brand
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "brand",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.brand && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.brand}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* images */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Images
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    className="w-full border rounded-md cursor-pointer focus:outline-none dark:text-gray-400 dark:placeholder-gray-400"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageChange}
                                                />
                                                <div className="py-1 text-red-400 text-xs">
                                                    {errorUpload}
                                                </div>
                                                <div className="py-1 grid grid-cols-4 gap-1 md:gap-1">
                                                    {updateObject.images.map(
                                                        (image) => (
                                                            <div
                                                                key={
                                                                    image.filename
                                                                }
                                                                className="h-16 w-auto relative"
                                                            >
                                                                <img
                                                                    src={
                                                                        image.path
                                                                    }
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <span
                                                                    onClick={
                                                                        null
                                                                    }
                                                                    className="w-4 h-4 text-center bg-red-200 text-xs text-red-500 rounded-full absolute -right-1 -top-2 select-none"
                                                                >
                                                                    X
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                    {images.map((image) => (
                                                        <div
                                                            key={image.name}
                                                            className="h-16 w-auto relative"
                                                        >
                                                            <img
                                                                src={
                                                                    image.preview
                                                                }
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <span
                                                                onClick={() =>
                                                                    removeImage(
                                                                        image
                                                                    )
                                                                }
                                                                className="w-4 h-4 text-center bg-red-200 text-xs text-red-500 rounded-full absolute -right-1 -top-2 select-none"
                                                            >
                                                                X
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* description */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <div className="flex-1">
                                                <textarea
                                                    value={
                                                        update
                                                            ? updateObject.description
                                                            : productObject.description
                                                    }
                                                    className={`w-full p-2 border rounded-md ${
                                                        errors.description &&
                                                        "border-red-400"
                                                    }`}
                                                    rows={5}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                ></textarea>
                                                {errors.description && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* colors */}
                                        <div className="mt-1 w-full flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Color
                                            </label>
                                            <ul className="mt-4 flex items-center flex-wrap gap-4">
                                                {colors.map((item, idx) => (
                                                    /* Color box */
                                                    <li
                                                        key={idx}
                                                        className="flex-none"
                                                    >
                                                        <label
                                                            htmlFor={item.bg}
                                                            className="block relative w-6 h-6"
                                                        >
                                                            <input
                                                                id={item.bg}
                                                                type="radio"
                                                                name="color"
                                                                value={
                                                                    item.value
                                                                }
                                                                className="sr-only peer"
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "color",
                                                                        e.target
                                                                            .value,
                                                                        true
                                                                    )
                                                                }
                                                                checked={
                                                                    update
                                                                        ? updateObject.color ===
                                                                          item.value
                                                                            ? true
                                                                            : false
                                                                        : undefined
                                                                }
                                                            />
                                                            <span
                                                                className={`inline-flex justify-center items-center w-full h-full rounded-full peer-checked:ring ring-offset-2 cursor-pointer duration-150 ${item.bg} ${item.ring}`}
                                                            ></span>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-5 h-5 text-white absolute inset-0 m-auto z-0 pointer-events-none hidden peer-checked:block duration-150"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M4.5 12.75l6 6 9-13.5"
                                                                />
                                                            </svg>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* status */}
                                        {update && (
                                            <div className="mt-2 w-full flex items-center">
                                                <label className="w-20 text-sm font-medium text-gray-700">
                                                    Status
                                                </label>
                                                <div className="flex-1">
                                                    <div className="relative w-full">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3 pointer-events-none"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        <select
                                                            value={
                                                                updateObject.status
                                                            }
                                                            className={`px-3 py-2 w-full border rounded-md outline-none appearance-none focus:ring-1 focus:ring-inset focus:ring-indigo-600`}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "status",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option value="active">
                                                                Active
                                                            </option>
                                                            <option value="deactive">
                                                                Deactive
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* footer */}
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex gap-2 justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={handleClick}
                                            disabled={pending ? true : false}
                                        >
                                            {pending ? (
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"
                                                    />
                                                </svg>
                                            ) : null}
                                            {update ? "Update" : "Create"}
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CategoryModal;
