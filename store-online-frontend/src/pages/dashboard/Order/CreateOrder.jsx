import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearState,
    setCreateCompleted,
    setError,
} from "../../../redux/slices/user.slice";
import {
    clearProductsState,
    fetchProductsContinuous,
} from "../../../redux/slices/product.slice";
import { IoAddCircle } from "react-icons/io5";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import FindCustomerBox from "../../../components/FindCustomerBox";
import CreateCustomerBox from "../../../components/CreateCustomerBox";
import { toast } from "react-toastify";
import { formattedPrice } from "../../../helpers/ultil";
import {
    fetchVoucherByCode,
    handleVoucherOnChange,
} from "../../../redux/slices/cart.slice";
import { createOrder } from "../../../redux/slices/order.slice";

const CreateOrder = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    // redux
    const { user, createCompleted, error } = useSelector((slice) => slice.user);
    const { createOrderCompleted, pending } = useSelector(
        (slice) => slice.order
    );
    const { products, totalPages } = useSelector((slice) => slice.product);
    const { voucher, discount } = useSelector((slice) => slice.cart);
    // useState
    // address
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    // note
    const [note, setNote] = useState("");
    // find customer
    const [searchProduct, setSearchProduct] = useState("");
    // selected customer
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerError, setSelectedCustomerError] = useState("");
    // create new customer
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    // list items
    const [listItem, setListItem] = useState([]);
    const [listItemError, setListItemError] = useState("");
    // total price
    const [totalPrice, setTotalPrice] = useState(0);
    const [page, setPage] = useState(1);

    // onchange input
    const handleAddProduct = (product) => {
        const foundIndex = listItem.findIndex(
            (item) => item.product === product._id
        );
        // if not found, add to list
        if (foundIndex === -1) {
            const object = {
                product: product._id,
                name: product.name,
                quantity: 1,
                price: product.price,
            };
            setListItem((pre) => [...pre, object]);
        }
        // set error none
        setListItemError("");
    };

    // increase item
    const handleIncrease = (_id) => {
        const foundIndex = listItem.findIndex((item) => item.product === _id);
        if (foundIndex !== -1) {
            setListItem((prevList) => {
                const updatedList = [...prevList];
                updatedList[foundIndex] = {
                    ...updatedList[foundIndex],
                    quantity: updatedList[foundIndex].quantity + 1,
                };
                return updatedList;
            });
        }
    };

    // decrease item
    const handleDecrease = (_id) => {
        const foundIndex = listItem.findIndex((item) => item.product === _id);
        if (foundIndex !== -1) {
            if (listItem[foundIndex].quantity === 1)
                setListItem((prevList) =>
                    prevList.filter((_, index) => index !== foundIndex)
                );
            else
                setListItem((prevList) => {
                    const updatedList = [...prevList];
                    updatedList[foundIndex] = {
                        ...updatedList[foundIndex],
                        quantity: updatedList[foundIndex].quantity - 1,
                    };
                    return updatedList;
                });
        }
    };

    useEffect(() => {
        const total = listItem.reduce(
            (total, item) => total + item.quantity * item.price,
            0
        );
        setTotalPrice(total);
    }, [listItem]);

    // create click button
    const handleClick = () => {
        // check validate
        const valid = checkValidate();
        if (valid) {
            // order object
            let orderObj = {
                cart: listItem,
                id: selectedCustomer._id,
                address: address,
                totalPrice: totalPrice,
                note: note,
            };
            // add voucher if voucher code is valid
            if (discount > 0) orderObj.voucherCode = voucher;

            // create new order
            dispatch(createOrder(orderObj));
        }
    };

    // cancel click button
    const handleClose = () => {
        setAddressError("");
        setSelectedCustomer(null);
        setListItem([]);
        setTotalPrice(0);
        setSelectedCustomerError("");
        setListItemError("");
        // clear redux state
        dispatch(clearProductsState());
        dispatch(clearState());
        onClose();
    };

    const checkValidate = () => {
        let valid = true;
        if (!selectedCustomer) {
            setSelectedCustomerError("This field is required");
            valid = false;
        }

        if (!address) {
            setAddressError("This field is required");
            valid = false;
        }

        if (listItem.length === 0) {
            setListItemError("Select at least one product");
            valid = false;
        }

        return valid;
    };

    useEffect(() => {
        if (createCompleted) {
            toast.success("Create new customer successfully !");
            setIsNewCustomer(false);
            setSelectedCustomer(user);
            dispatch(setCreateCompleted());
        }
        if (error) {
            toast.error("Something wrong happened, please try again later !");
            dispatch(setError());
        }
        if (createOrderCompleted) handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted, createOrderCompleted, error]);

    useEffect(() => {
        setPage(1);
        dispatch(
            fetchProductsContinuous({
                searchString: searchProduct,
                page: 1,
            })
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchProduct]);

    useEffect(() => {
        if (page > 1)
            dispatch(
                fetchProductsContinuous({
                    searchString: searchProduct,
                    page,
                })
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

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
                                    Add New Order
                                </Dialog.Title>
                                {/* create new customer */}
                                {selectedCustomer ? (
                                    <div className="relative my-2 p-2 text-xs bg-gray-100 rounded-md">
                                        <div>
                                            Name: {selectedCustomer.fullname}
                                        </div>
                                        <div className="my-1">
                                            Phone: {selectedCustomer.phone}
                                        </div>
                                        <div>
                                            Email: {selectedCustomer.email}
                                        </div>
                                        <div className="absolute -right-2 -top-2">
                                            <button
                                                className="w-5 h-5 bg-red-200 text-white rounded-full z-10"
                                                onClick={() =>
                                                    setSelectedCustomer(null)
                                                }
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ) : isNewCustomer ? (
                                    // create new customer
                                    <CreateCustomerBox
                                        onClose={setIsNewCustomer}
                                    />
                                ) : (
                                    <>
                                        {/* customer */}
                                        <div className="mt-4 flex items-center">
                                            <label className="w-20 text-sm font-medium text-gray-700">
                                                Customer
                                            </label>
                                            <div className="flex-1">
                                                <FindCustomerBox
                                                    selected={
                                                        setSelectedCustomer
                                                    }
                                                    error={
                                                        selectedCustomerError
                                                    }
                                                />
                                                {selectedCustomerError && (
                                                    <span className="text-xs text-red-500">
                                                        *{" "}
                                                        {selectedCustomerError}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full text-right">
                                            <button
                                                className="text-xs"
                                                onClick={() =>
                                                    setIsNewCustomer(true)
                                                }
                                            >
                                                Create new customer
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Address */}
                                <div className="flex items-center">
                                    <label className="w-20 text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className={`w-full p-2 border rounded-md ${
                                                addressError && "border-red-400"
                                            }`}
                                            placeholder="Shipping address"
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                                setAddressError("");
                                            }}
                                        />
                                        {addressError && (
                                            <span className="text-xs text-red-500">
                                                * {addressError}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* search product */}
                                <div className="mt-4 flex items-center">
                                    <label className="w-20 text-sm font-medium text-gray-700">
                                        Search
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className={`w-full p-2 border rounded-md`}
                                            placeholder="product name"
                                            onChange={(e) =>
                                                setSearchProduct(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                {/* product list */}
                                <div className="mt-4 text-sm">
                                    <label className="w-20 font-medium text-gray-700">
                                        List products
                                    </label>
                                    <div className="mt-1 px-2 h-24 border border-custom-500 rounded-md overflow-y-scroll">
                                        {products.length > 0 ? (
                                            <>
                                                {products.map((item) => (
                                                    <div
                                                        key={item._id}
                                                        className="py-1 flex justify-between border-b border-custom-300"
                                                    >
                                                        <p className="text-xs">
                                                            {item.name}
                                                        </p>
                                                        <div className="flex gap-2 items-center select-none">
                                                            {item.quantity >
                                                            0 ? (
                                                                <span
                                                                    className={`${
                                                                        item.status ===
                                                                        "active"
                                                                            ? "bg-green-100 text-green-600"
                                                                            : "bg-red-100 text-red-600"
                                                                    } px-2 text-xs rounded-lg`}
                                                                >
                                                                    {
                                                                        item.status
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className={`bg-gray-200 text-gray-600 px-2 text-xs rounded-lg`}
                                                                >
                                                                    Out of stock
                                                                </span>
                                                            )}

                                                            <button
                                                                onClick={() =>
                                                                    handleAddProduct(
                                                                        item
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity >
                                                                        0 &&
                                                                    item.status ===
                                                                        "active"
                                                                        ? false
                                                                        : true
                                                                }
                                                            >
                                                                <IoAddCircle
                                                                    size={24}
                                                                    color={
                                                                        item.quantity >
                                                                            0 &&
                                                                        item.status ===
                                                                            "active"
                                                                            ? "blue"
                                                                            : "gray"
                                                                    }
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {page < totalPages && (
                                                    <div className="w-full flex justify-center">
                                                        <button
                                                            className="my-2 py-1 px-2 text-xs text-white bg-green-500 border rounded-md"
                                                            onClick={() =>
                                                                setPage(
                                                                    (pre) =>
                                                                        pre + 1
                                                                )
                                                            }
                                                        >
                                                            Load more
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <span>Not Found</span>
                                        )}
                                    </div>
                                </div>

                                {/* list add product */}
                                <div className="mt-4 text-sm">
                                    <label className="w-20 font-medium text-gray-700">
                                        List orders
                                    </label>
                                    <div
                                        className={`mt-1 px-2 h-24 border border-custom-500 rounded-md overflow-y-scroll ${
                                            listItemError && "border-red-400"
                                        }`}
                                    >
                                        {listItem.length > 0 &&
                                            listItem.map((item, idx) => (
                                                <div
                                                    key={item.product}
                                                    className="flex justify-between"
                                                >
                                                    <div className="select-none">
                                                        #{idx + 1}. {item.name}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CiCircleMinus
                                                            onClick={() =>
                                                                handleDecrease(
                                                                    item.product
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        />
                                                        <div className="w-5 text-center select-none">
                                                            {item.quantity}
                                                        </div>
                                                        <CiCirclePlus
                                                            onClick={() =>
                                                                handleIncrease(
                                                                    item.product
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        {listItem.length === 0 && (
                                            <div className="mt-1 text-center text-custom-1000">
                                                ========== Empty list ==========
                                            </div>
                                        )}
                                    </div>
                                    {listItem.length > 0 && (
                                        <div className="mt-1 text-right">
                                            Total price:{" "}
                                            {formattedPrice(totalPrice)}
                                        </div>
                                    )}
                                    {listItemError && (
                                        <span className="text-xs text-red-500">
                                            * {listItemError}
                                        </span>
                                    )}
                                </div>

                                {/* voucher */}
                                <div className="mt-4 flex items-center">
                                    <label className="w-20 text-sm font-medium text-gray-700">
                                        Voucher
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className={`w-full p-2 border rounded-md`}
                                            placeholder="promote code"
                                            onChange={(e) => {
                                                dispatch(
                                                    fetchVoucherByCode(
                                                        e.target.value
                                                    )
                                                );
                                                dispatch(
                                                    handleVoucherOnChange(
                                                        e.target.value
                                                    )
                                                );
                                            }}
                                        />
                                        {discount > 0 && (
                                            <span className="text-xs text-red-500 text-right">
                                                discount {discount}%
                                            </span>
                                        )}
                                        {discount < 0 && (
                                            <span className="text-xs text-red-500 text-right">
                                                * Voucher code is not valid
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* note */}
                                <div className="mt-4 flex items-center">
                                    <label className="w-20 text-sm font-medium text-gray-700">
                                        Note
                                    </label>
                                    <div className="flex-1">
                                        <textarea
                                            className="w-full p-2 border rounded-md"
                                            rows="3"
                                            onChange={(e) =>
                                                setNote(e.target.value)
                                            }
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        disabled={pending ? true : false}
                                        type="button"
                                        className="inline-flex gap-2 justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={handleClick}
                                    >
                                        {pending ? (
                                            <>
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
                                                <p>Loading ...</p>
                                            </>
                                        ) : (
                                            <p>Create</p>
                                        )}
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

export default CreateOrder;
