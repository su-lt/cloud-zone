import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
    handleOnChangeUpdate,
    updateOrder,
    clearState,
} from "../../../redux/slices/order.slice";

const UpdateOrder = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { updateObject, updateCompleted, error } = useSelector(
        (slice) => slice.order
    );

    // onchange input
    const handleChange = (field, value) => {
        dispatch(handleOnChangeUpdate({ field, value }));
    };

    // create click button
    const handleClick = () => {
        dispatch(updateOrder(updateObject));
    };

    // cancel click button
    const handleClose = () => {
        onClose();
        dispatch(clearState());
    };

    useEffect(() => {
        if (updateCompleted || error) handleClose();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateCompleted, error]);

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
                            <div>
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Detail OrderCode:{" "}
                                    <span className="text-red-500">
                                        #{updateObject && updateObject.code}
                                    </span>
                                </Dialog.Title>
                                {updateObject && (
                                    <>
                                        {/* fullname  */}
                                        <div className="mt-10 flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Fullname
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 border rounded-md`}
                                                    value={
                                                        updateObject.user
                                                            .fullname
                                                    }
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        {/* address  */}
                                        <div className="mt-4 flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Address
                                            </label>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 border rounded-md`}
                                                    value={updateObject.address}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        {/* items  */}
                                        <div className="mt-4 flex">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Products
                                            </label>
                                            <div className="flex-1 select-none">
                                                {updateObject.items.map(
                                                    (item, idx) =>
                                                        item.product && (
                                                            <div
                                                                key={item._id}
                                                                className={`relative mt-2 flex items-center w-full text-xs text-gray-500 border rounded-md ${
                                                                    item.product
                                                                        .status !==
                                                                    "active"
                                                                        ? "border-red-400"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`absolute -top-2 -left-2 w-4 h-4 flex justify-center items-center rounded-full  ${
                                                                        item
                                                                            .product
                                                                            .status !==
                                                                        "active"
                                                                            ? "bg-red-300 text-white"
                                                                            : "bg-gray-300"
                                                                    }`}
                                                                >
                                                                    {idx + 1}
                                                                </span>
                                                                {item.product
                                                                    .status !==
                                                                    "active" && (
                                                                    <span className="absolute -top-2 -right-2 px-2 bg-red-300 text-white rounded-md">
                                                                        Out of
                                                                        stock
                                                                    </span>
                                                                )}
                                                                <div className="flex-1 p-2">
                                                                    <div>
                                                                        Name:{" "}
                                                                        {
                                                                            item
                                                                                .product
                                                                                .name
                                                                        }
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        Quantity:{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="h-16 w-auto mr-2">
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .product
                                                                                .image_thumbnail
                                                                        }
                                                                        alt=""
                                                                        className="w-full h-full object-cover rounded-md"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                )}
                                            </div>
                                        </div>
                                        {/* note  */}
                                        <div className="mt-10 flex">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Note
                                            </label>
                                            <div className="flex-1">
                                                <textarea
                                                    value={updateObject.note}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "note",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows="4"
                                                    className="w-full p-2 border rounded-md"
                                                ></textarea>
                                            </div>
                                        </div>
                                        {/* status */}
                                        <div className="mt-4 flex items-center">
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
                                                            handleChange(
                                                                "status",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="cancel">
                                                            Cancel
                                                        </option>
                                                        <option value="pending">
                                                            Pending
                                                        </option>
                                                        <option value="processing">
                                                            Processing
                                                        </option>
                                                        <option value="shipping">
                                                            Shipping
                                                        </option>
                                                        <option value="delivered">
                                                            Delivered
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={handleClick}
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UpdateOrder;
