import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
    handleOnChange,
    createCategory,
    clearState,
} from "../../../redux/slices/category.slice";

const CreateCategory = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { createObject, errors, createCompleted } = useSelector(
        (slice) => slice.category
    );

    // onchange input
    const handleChange = (field, value) => {
        dispatch(handleOnChange({ field, value }));
    };

    // create click button
    const handleClick = () => {
        dispatch(createCategory(createObject.name));
    };

    // cancel click button
    const handleClose = () => {
        onClose();
        dispatch(clearState());
    };

    useEffect(() => {
        if (createCompleted) handleClose();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted]);

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
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                Add New Category
                            </Dialog.Title>

                            <div className="mt-5 w-full flex items-center">
                                <label className="w-20 text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className={`w-full p-2 border rounded-md ${
                                            errors?.name && "border-red-400"
                                        }`}
                                        value={createObject.name}
                                        onChange={(e) =>
                                            handleChange("name", e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <span className="text-xs text-red-500">
                                            * {errors.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleClick}
                                >
                                    Create
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
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreateCategory;
