import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { useEffect } from "react";
import { cartSlice, fetchProductById } from "../../redux/slices/cart.slice";

const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Shoping Cart", link: "" },
];

const Cart = () => {
    const dispatch = useDispatch();

    const { cart, totalPrice } = useSelector((slice) => slice.cart);

    const handleChange = (quantity, _id) => {
        if (quantity === 0) handleDelete(_id);

        const obj = {
            _id,
            quantity,
        };
        dispatch(cartSlice.actions.updateQuantity(obj));
    };

    const handleDelete = (_id) => {
        dispatch(cartSlice.actions.removeProduct(_id));
    };

    useEffect(() => {
        cart.forEach((item) => {
            dispatch(fetchProductById(item._id));
        });
    }, [cart, dispatch]);

    return (
        <main className="md:mt-10 p-4 md:container">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4">
                <h3>Cart list</h3>
                <div className="my-4 grid xl:grid-cols-3 xl:gap-x-10">
                    <div className="xl:col-span-2">
                        {cart.length > 0 && cart[0].name ? (
                            cart.map((item) => (
                                <div
                                    className="p-5 flex gap-x-5 border border-b-0 border-custom-500 relative group"
                                    key={item._id}
                                >
                                    <div className="absolute -top-3 -right-2 w-5 h-5 hidden group-hover:block">
                                        <button
                                            className="w-full h-full bg-red-300 text-white text-xs leading-3 rounded-full "
                                            onClick={() =>
                                                handleDelete(item._id)
                                            }
                                        >
                                            X
                                        </button>
                                    </div>
                                    <div className="w-auto h-36 lg:h-24">
                                        <img
                                            alt=""
                                            src={item.image_thumbnail}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col lg:flex-row items-start justify-between flex-1">
                                        <div className="w-full">
                                            <h4 className="">{item.name}</h4>
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
                                                            item.quantity - 1,
                                                            item._id
                                                        )
                                                    }
                                                >
                                                    &#45;
                                                </div>
                                                <input
                                                    className="bg-custom-100 border-r border-l border-custom-300 w-[45px] focus:outline-none h-[38px] text-center"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e.target.value,
                                                            item._id
                                                        )
                                                    }
                                                />
                                                <div
                                                    className="flex-grow leading-10 cursor-pointer hover:bg-primary hover:text-white select-none"
                                                    onClick={() =>
                                                        handleChange(
                                                            item.quantity + 1,
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
                            ))
                        ) : (
                            <div className="p-5 flex gap-x-5 border border-b-0 border-custom-500 text-center">
                                Cart empty
                            </div>
                        )}

                        {/* apply voucher */}
                        <div className="p-5 flex justify-between border border-custom-500">
                            <input
                                type="text"
                                className="pl-2 border border-custom-500 rounded-xl focus:outline-orange-400"
                                placeholder="voucher code"
                            />
                            <button className="px-4 sm:text-lg sm:px-8 sm:py-4 py-3 text-xs border border-custom-500 rounded-xl">
                                Apply voucher
                            </button>
                        </div>
                    </div>
                    <div className="mt-10 xl:mt-0 max-w-[600px] mx-auto">
                        <div className="p-7 border border-custom-500">
                            <h2 className="font-bold uppercase">Cart total</h2>
                            <div className="mt-5 flex">
                                <h4 className="w-[100px]">Subtotal:</h4>
                                <h4>$ {Math.round(totalPrice * 100) / 100}</h4>
                            </div>
                            <div className="flex my-3 py-5 border-t border-b border-custom-500 border-dotted">
                                <div>
                                    <h4 className="w-[100px]">Shipping:</h4>
                                </div>
                                <div className="tracking-wide">
                                    <p>
                                        There are no shipping methods available.
                                        Please double check your address, or
                                        contact us if you need any help.
                                    </p>
                                    <h4 className="uppercase mt-3">
                                        CALCULATE SHIPPING
                                    </h4>
                                    <input
                                        type="text"
                                        className="mt-3 w-full p-2 border border-custom-500 rounded-sm"
                                        placeholder="Your country"
                                    />
                                    <input
                                        type="text"
                                        className="mt-3 w-full p-2 border border-custom-500 rounded-sm"
                                        placeholder="State / country"
                                    />
                                    <input
                                        type="text"
                                        className="mt-3 w-full p-2 border border-custom-500 rounded-sm"
                                        placeholder="Postcode / Zip"
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <h4 className="w-[100px]">Total:</h4>
                                <h4>$ {Math.round(totalPrice * 100) / 100}</h4>
                            </div>
                            <button className="mt-3 w-full py-4 text-white uppercase text-xl font-semibold bg-primary rounded-xl hover:bg-white hover:border hover:border-primary  hover:text-primary">
                                proceed to checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;
