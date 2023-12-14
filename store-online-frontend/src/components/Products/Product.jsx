import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AlertMessage from "../AlertMessage";
import { cartSlice } from "../../redux/slices/cart.slice";
import { formattedPrice } from "../../helpers/ultil";

const Product = ({ product }) => {
    const dispatch = useDispatch();

    const [expand, setExpand] = useState(false);
    const [selectImage, setSelectImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (message) => {
        setAlertMessage(message);

        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
            setAlertMessage("");
        }, 2000);
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value) || 1;
        setQuantity(value);
    };

    const handleAddToCart = () => {
        const orderObject = {
            _id: product._id,
            price: product.price,
            quantity,
        };

        // save cart to localStorage, redux state
        dispatch(cartSlice.actions.addToCart(orderObject));

        showAlert("Product added to cart.");
        setQuantity(1);
    };

    useEffect(() => {
        product && setSelectImage(product.productDetail.images[0]);
    }, [product]);

    return (
        <div className="mt-4">
            {/* show message add to cart */}
            {alertMessage && (
                <AlertMessage
                    message={alertMessage}
                    onClose={() => setAlertMessage("")}
                />
            )}
            {product && (
                <>
                    <div className="grid gap-y-10 sm:grid-cols-3 sm:gap-x-5">
                        <div className="sm:col-span-2 flex gap-2">
                            <div className="flex flex-col gap-y-2">
                                {product.productDetail.images.map((img) => (
                                    <div
                                        className="w-[75px] h-[75px] max-h-[800px] overflow-hidden"
                                        key={img.filename}
                                        onClick={() => setSelectImage(img)}
                                    >
                                        <img
                                            src={img.path}
                                            alt={img.filename}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="">
                                <img
                                    src={selectImage.path}
                                    alt={selectImage.filename}
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="sm:text-xl md:text-2xl">
                                {product.name}
                            </h2>
                            <h5 className="mt-1 text-custom-1000">
                                Brand: {product.productDetail.brand}
                            </h5>
                            <h3 className="mt-14 mb-4 text-primary font-semibold tracking-wider">
                                {formattedPrice(product.price)}
                            </h3>

                            <div className="w-[135px] h-[40px] flex items-center border border-custom-300 rounded-sm text-center">
                                <div
                                    className="flex-grow leading-10 cursor-pointer hover:bg-primary hover:text-white select-none"
                                    onClick={
                                        quantity > 1
                                            ? () => setQuantity(quantity - 1)
                                            : () => {}
                                    }
                                >
                                    &#45;
                                </div>
                                <input
                                    className="bg-custom-100 border-r border-l border-custom-300 w-[45px] focus:outline-none h-[38px] text-center"
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                                <div
                                    className="flex-grow leading-10 cursor-pointer hover:bg-primary hover:text-white select-none"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    &#43;
                                </div>
                            </div>
                            <div>
                                <button
                                    className="button-primary bg-primary text-white mt-8"
                                    onClick={handleAddToCart}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 p-4  border border-custom-300">
                        <h3 className="font-medium">Decription</h3>
                        <p
                            className={`${
                                expand
                                    ? `line-clamp-none max-h-none`
                                    : `line-clamp-5 max-h-[100px] shadow-text`
                            } mt-4 mb-5 text-sm text-justify relative`}
                        >
                            {product.productDetail.description}
                        </p>
                        <input
                            type="checkbox"
                            className="p-2 appearance-none border border-custom-300 rounded-sm cursor-pointer hover:text-white hover:bg-primary before:content-['Expand'] checked:before:content-['Collapse']"
                            checked={expand}
                            onChange={() => setExpand(!expand)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Product;
