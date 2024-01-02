import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SiShopify } from "react-icons/si";
import {
    cartSlice,
    createOrder,
    fetchProductById,
    fetchCities,
    fetchDistricts,
    fetchWards,
    setAddress,
    setFullAddress,
    updateQuantity,
    clearAddress,
    handleVoucherOnChange,
    fetchVoucherByCode,
} from "../../redux/slices/cart.slice";
import { fetchUserAddress } from "../../redux/slices/user.slice";
import { Link } from "react-router-dom";
import { formattedPrice } from "../../helpers/ultil";
import {
    handleOnChange,
    login,
    setLastPage,
} from "../../redux/slices/auth.slice";
import AutocompleteBox from "../../components/AutocompleteBox";
import Modal from "../../components/CartModal";
import Breadcrumb from "../../components/Breadcrumb";

const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Shoping Cart", link: "" },
];

const Cart = () => {
    const dispatch = useDispatch();
    // state redux
    // cart state
    const {
        cart,
        totalPrice,
        voucher,
        discount,
        cities,
        districts,
        wards,
        address,
        fullAddress,
        createCompleted,
        orderError,
        orderCode,
    } = useSelector((slice) => slice.cart);
    // auth state
    const { id, isLogin, loginObject, lastPage, completed, errors, error } =
        useSelector((slice) => slice.auth);
    // user state
    const { defaultAddress } = useSelector((slice) => slice.user);

    // useState
    const [showCheckout, setShowCheckout] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // handle change items
    const handleChange = (quantity, _id) => {
        if (quantity === 0) handleDelete(_id);
        const obj = {
            _id,
            quantity,
        };
        dispatch(updateQuantity(obj));
    };

    // handle city change
    const handleCity = (item) => {
        dispatch(fetchDistricts(item.code));
        dispatch(setAddress({ field: "city", value: item.name }));
    };

    // handle district change
    const handleDistrict = (item) => {
        dispatch(fetchWards(item.code));
        dispatch(setAddress({ field: "district", value: item.name }));
    };
    // handle ward change
    const handleWard = (item) => {
        dispatch(setAddress({ field: "ward", value: item.name }));
    };

    // handle processing
    const handleProcess = () => {
        // check out of stock items
        const isOutOfStock = cart.some(
            (item) => item.out_of_stock || item.quantity > item.stock
        );
        if (isOutOfStock) {
            setShowModal(true);
            return;
        }

        setShowCheckout(false);
        if (isLogin) {
            dispatch(fetchUserAddress(id));
            dispatch(
                setFullAddress(
                    `${address.street} ${address.ward} ${address.district} ${address.city}`
                )
            );
            setShowConfirm(true);
        } else setShowLogin(true);
    };

    // handle got it button click
    const handleClickButton = () => {
        // remove out of stock items
        const outOfStockItems = cart.filter(
            (item) => item.out_of_stock || item.quantity > item.stock
        );
        outOfStockItems.forEach((item) => {
            handleDelete(item._id);
        });
        setShowModal(false);

        // continue processing
        setShowCheckout(false);
        if (isLogin) {
            dispatch(fetchUserAddress(id));
            dispatch(
                setFullAddress(
                    `${address.street} ${address.ward} ${address.district} ${address.city}`
                )
            );
            setShowConfirm(true);
        } else setShowLogin(true);
    };

    // handle login onchange
    const handleLoignChange = (field, value) => {
        dispatch(handleOnChange({ field, value }));
    };

    // handle login button
    const handleLoginClick = async () => {
        dispatch(login(loginObject));
    };

    // handle confirm button
    const handleConfirmClick = async () => {
        dispatch(
            createOrder({
                cart,
                id,
                address: fullAddress,
                totalPrice,
                voucherCode: voucher,
            })
        );
    };

    // remove items
    const handleDelete = (_id) => {
        dispatch(cartSlice.actions.removeProduct(_id));
    };

    // fetch items
    useEffect(() => {
        cart.forEach((item) => {
            dispatch(fetchProductById(item._id));
        });
    }, [cart, dispatch]);

    // fetch default user address
    useEffect(() => {
        if (completed) {
            dispatch(fetchUserAddress(id));
            dispatch(
                setFullAddress(
                    `${address.street} ${address.ward} ${address.district} ${address.city}`
                )
            );
            setShowLogin(false);
            setShowConfirm(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completed]);

    useEffect(() => {
        if (createCompleted) {
            setShowCheckout(false);
            setShowLogin(false);
            setShowConfirm(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createCompleted]);

    // fetch cities
    useEffect(() => {
        dispatch(fetchCities());

        // clearup
        return () => {
            dispatch(clearAddress());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="flex-1 dark:text-custom-1000">
            <Modal
                open={showModal}
                close={() => setShowModal(false)}
                handleClickButton={handleClickButton}
            />
            <div className="md:mt-10 p-4 md:container">
                <Breadcrumb items={breadcrumbItems} />
                <div className="mt-4">
                    {/* create order fail */}
                    {orderError && (
                        <div className="p-7 flex justify-center items-center border border-custom-500">
                            Order fail, please try again !
                        </div>
                    )}
                    {createCompleted && orderCode && (
                        <div className="p-7 flex flex-col justify-center items-center border border-custom-500">
                            <h4>Thank you for your shopping</h4>
                            <h5 className="flex">
                                Your order code is:
                                <p className="text-red-500"> #{orderCode}</p>
                            </h5>
                        </div>
                    )}

                    {!createCompleted && !orderError && (
                        <>
                            <h3>Cart list</h3>
                            <div className="my-4 grid xl:grid-cols-3 xl:gap-x-10">
                                <div className="xl:col-span-2">
                                    {cart.length > 0 &&
                                        cart.map((item) => (
                                            <div
                                                className="p-5 flex gap-x-5 border border-b-0 border-custom-500 relative group"
                                                key={item._id}
                                            >
                                                {item.out_of_stock && (
                                                    <div className="absolute top-1 left-1 p-1 bg-red-300 text-white text-xs leading-3 rounded-md">
                                                        Out of stock
                                                    </div>
                                                )}
                                                {item.quantity > item.stock && (
                                                    <div className="absolute top-1 left-1 p-1 bg-red-300 text-white text-xs leading-3 rounded-md">
                                                        {`Only ${item.stock} items in stock`}
                                                    </div>
                                                )}
                                                <div className="absolute -top-3 -right-2 w-5 h-5 md:hidden group-hover:block">
                                                    <button
                                                        className="w-full h-full bg-red-300 text-white text-xs leading-3 rounded-full "
                                                        onClick={() =>
                                                            handleDelete(
                                                                item._id
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                                <div className="w-auto h-36 lg:h-24">
                                                    <img
                                                        alt=""
                                                        src={
                                                            item.image_thumbnail
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col lg:flex-row items-start justify-between flex-1">
                                                    <div className="w-full">
                                                        <h4 className="">
                                                            {item.name}
                                                        </h4>
                                                    </div>
                                                    <div className="mt-4 flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row sm:items-center lg:mt-0 lg:items-start lg:gap-10">
                                                        <h3 className="w-[100px]">
                                                            $ {item.price}
                                                        </h3>

                                                        <div className="w-[135px] h-[40px] flex items-center border border-custom-300 rounded-sm text-center">
                                                            <div
                                                                className="flex-grow leading-10 cursor-pointer hover:bg-primary hover:text-white select-none"
                                                                onClick={() =>
                                                                    handleChange(
                                                                        item.quantity -
                                                                            1,
                                                                        item._id
                                                                    )
                                                                }
                                                            >
                                                                &#45;
                                                            </div>
                                                            <input
                                                                className="bg-custom-100 border-r border-l border-custom-300 w-[45px] focus:outline-none h-[38px] text-center"
                                                                type="number"
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        e.target
                                                                            .value,
                                                                        item._id
                                                                    )
                                                                }
                                                            />
                                                            <div
                                                                className="flex-grow leading-10 cursor-pointer hover:bg-primary hover:text-white select-none"
                                                                onClick={() =>
                                                                    handleChange(
                                                                        item.quantity +
                                                                            1,
                                                                        item._id
                                                                    )
                                                                }
                                                            >
                                                                &#43;
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {cart.length === 0 && (
                                        <Link
                                            to="/products"
                                            className="p-5 text-center"
                                        >
                                            <p>Oops, cart empty</p>
                                            <div className="flex gap-x-5 justify-center items-center">
                                                Back to shopping now
                                                <SiShopify size={50} />
                                            </div>
                                        </Link>
                                    )}

                                    {/*  apply voucher */}
                                    {cart.length > 0 && (
                                        <div className="p-5 flex justify-between border border-custom-500">
                                            <input
                                                type="text"
                                                className="pl-2 border border-custom-500 rounded-xl focus:outline-orange-400"
                                                placeholder="voucher code"
                                                onChange={(e) =>
                                                    dispatch(
                                                        handleVoucherOnChange(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            />
                                            <button
                                                className="px-4 sm:text-lg sm:px-8 sm:py-4 py-3 text-xs border border-custom-500 rounded-xl"
                                                onClick={() =>
                                                    dispatch(
                                                        fetchVoucherByCode(
                                                            voucher
                                                        )
                                                    )
                                                }
                                            >
                                                Apply voucher
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* total cart */}
                                {!lastPage &&
                                    showCheckout &&
                                    cart.length > 0 && (
                                        <div className="mt-10 xl:mt-0 max-w-[600px] mx-auto">
                                            <div className="p-7 border border-custom-500">
                                                <h2 className="font-bold uppercase">
                                                    Cart total
                                                </h2>
                                                <div className="mt-5 flex">
                                                    <h4 className="w-[110px]">
                                                        Subtotal:
                                                    </h4>
                                                    <h4>
                                                        {formattedPrice(
                                                            totalPrice
                                                        )}
                                                    </h4>
                                                </div>
                                                <div className="flex my-3 py-5 border-t border-b border-custom-500 border-dotted">
                                                    <div>
                                                        <h4 className="w-[110px]">
                                                            Shipping:
                                                        </h4>
                                                    </div>
                                                    <div className="tracking-wide">
                                                        <p>
                                                            There are no
                                                            shipping methods
                                                            available. Please
                                                            double check your
                                                            address, or contact
                                                            us if you need any
                                                            help.
                                                        </p>
                                                        <h4 className="uppercase mt-3">
                                                            CALCULATE SHIPPING
                                                        </h4>
                                                        {/* citis */}
                                                        <AutocompleteBox
                                                            items={cities}
                                                            setSelected={
                                                                handleCity
                                                            }
                                                            selected={
                                                                address.city
                                                            }
                                                        />

                                                        {/* districts */}
                                                        <AutocompleteBox
                                                            items={districts}
                                                            setSelected={
                                                                handleDistrict
                                                            }
                                                            selected={
                                                                address.district
                                                            }
                                                        />

                                                        {/* wards */}
                                                        <AutocompleteBox
                                                            items={wards}
                                                            setSelected={
                                                                handleWard
                                                            }
                                                            selected={
                                                                address.ward
                                                            }
                                                        />
                                                        {/* street */}
                                                        <input
                                                            onChange={(e) =>
                                                                dispatch(
                                                                    setAddress({
                                                                        field: "street",
                                                                        value: e
                                                                            .target
                                                                            .value,
                                                                    })
                                                                )
                                                            }
                                                            type="text"
                                                            className="mt-3 w-full p-2 border border-custom-500 rounded-sm"
                                                            placeholder="Street address"
                                                        />
                                                    </div>
                                                </div>
                                                {address.city &&
                                                    address.district &&
                                                    address.ward &&
                                                    address.street && (
                                                        <div className="flex">
                                                            <h4 className="w-[110px]">
                                                                Shiping fee:
                                                            </h4>
                                                            <h4>
                                                                {formattedPrice(
                                                                    0
                                                                )}
                                                            </h4>
                                                        </div>
                                                    )}

                                                {discount > 0 && (
                                                    <div className="flex">
                                                        <h4 className="w-[110px]">
                                                            Discount:
                                                        </h4>
                                                        <h4>{discount}%</h4>
                                                    </div>
                                                )}
                                                <div className="flex">
                                                    <h4 className="w-[110px]">
                                                        Total:
                                                    </h4>
                                                    <h4>
                                                        {formattedPrice(
                                                            totalPrice -
                                                                (totalPrice *
                                                                    discount) /
                                                                    100
                                                        )}
                                                    </h4>
                                                </div>
                                                <button
                                                    onClick={handleProcess}
                                                    className="mt-3 w-full py-4 text-white uppercase text-xl font-semibold bg-primary rounded-xl hover:bg-white hover:border hover:border-primary  hover:text-primary"
                                                >
                                                    proceed to checkout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                {/* show login form */}
                                {showLogin && cart.length > 0 && (
                                    <div className="mt-10 xl:mt-0 max-w-[600px] w-full mx-auto">
                                        <div className="p-7 flex flex-col gap-2 border border-custom-500">
                                            {error && (
                                                <div className="p-3 text-center bg-red-200">
                                                    {error}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <input
                                                    type="text"
                                                    placeholder="Your email"
                                                    className={`input-outline-none ${
                                                        errors.email &&
                                                        "border-red-400"
                                                    }`}
                                                    onChange={(e) =>
                                                        handleLoignChange(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.email && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.email}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    className={`input-outline-none ${
                                                        errors.password &&
                                                        "border-red-400"
                                                    }`}
                                                    onChange={(e) =>
                                                        handleLoignChange(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.password && (
                                                    <span className="text-xs text-red-500">
                                                        * {errors.password}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-3">
                                                <button
                                                    className="button-primary w-full"
                                                    onClick={handleLoginClick}
                                                >
                                                    Login
                                                </button>
                                            </div>
                                            <div className="mt-3 mx-auto">
                                                <div className="border-b w-[150px]"></div>
                                            </div>
                                            <Link
                                                to="/register"
                                                onClick={() =>
                                                    dispatch(
                                                        setLastPage("/cart")
                                                    )
                                                }
                                                className="mt-2 text-center text-xs"
                                            >
                                                Or register if you don't have
                                                account
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* show confirm form */}
                                {isLogin && showConfirm && cart.length > 0 && (
                                    <div className="p-7 mt-10 xl:mt-0 max-w-[600px] w-full mx-auto border border-custom-500">
                                        <h3>Receipts:</h3>
                                        <div className="mt-3 w-full flex justify-between font-semibold">
                                            <p>Description</p>
                                            <p>Price</p>
                                        </div>
                                        {cart.map((item) => (
                                            <div
                                                key={item._id}
                                                className="w-full flex justify-between"
                                            >
                                                <div>{item.name}</div>
                                                <div>
                                                    {`${
                                                        item.quantity
                                                    } x ${formattedPrice(
                                                        item.price
                                                    )}`}
                                                </div>
                                            </div>
                                        ))}
                                        {discount > 0 && (
                                            <div className="mt-3 w-full flex justify-between font-semibold">
                                                <p>Discount</p>
                                                <p>{discount}%</p>
                                            </div>
                                        )}
                                        <div className="mt-3 w-full flex justify-between font-semibold">
                                            <p>Total</p>
                                            <p>
                                                {discount
                                                    ? formattedPrice(
                                                          totalPrice -
                                                              (totalPrice *
                                                                  discount) /
                                                                  100
                                                      )
                                                    : formattedPrice(
                                                          totalPrice
                                                      )}
                                            </p>
                                        </div>
                                        <h3 className="mt-5">
                                            Shipping Address:
                                        </h3>
                                        {defaultAddress && (
                                            <div className="mt-4 flex items-start gap-4">
                                                <input
                                                    className="mt-1"
                                                    type="radio"
                                                    name="address"
                                                    id="address-default"
                                                    onChange={(e) => {
                                                        dispatch(
                                                            setFullAddress(
                                                                e.target.value
                                                            )
                                                        );
                                                    }}
                                                    value={defaultAddress}
                                                />
                                                <label htmlFor="address-default">
                                                    <p>
                                                        Default address:{" "}
                                                        {defaultAddress}
                                                    </p>
                                                </label>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-4">
                                            <input
                                                className="mt-1"
                                                type="radio"
                                                name="address"
                                                id="address"
                                                onChange={(e) => {
                                                    dispatch(
                                                        setFullAddress(
                                                            e.target.value
                                                        )
                                                    );
                                                }}
                                                value={`${address.street} ${address.ward} ${address.district} ${address.city}`}
                                                defaultChecked
                                            />
                                            <label htmlFor="address">
                                                <p>
                                                    Order address:
                                                    {` ${address.street} ${address.ward} ${address.district} ${address.city}`}
                                                </p>
                                            </label>
                                        </div>
                                        <div className="mt-3">
                                            <button
                                                onClick={handleConfirmClick}
                                                className="button-primary w-full"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Cart;
