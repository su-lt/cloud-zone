import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularProducts } from "../../redux/slices/product.slice";
import { formattedPrice } from "../../helpers/ultil";

const popularData = [
    {
        id: "1",
        product_id: "123",
        product_name: "product 1",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
    {
        id: "2",
        product_id: "123",
        product_name: "product 2",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
    {
        id: "3",
        product_id: "123",
        product_name: "product 3",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
    {
        id: "4",
        product_id: "123",
        product_name: "product 4",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
];

const PopularProducts = () => {
    const dispatch = useDispatch();
    const { popularProducts } = useSelector((slice) => slice.product);

    useEffect(() => {
        dispatch(fetchPopularProducts());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="p-4 pt-3 w-full min-w-[265px] xl:w-96 bg-white rounded-sm border-gray-200 ">
            <strong className="text-gray-700 font-medium">
                Popular Products
            </strong>
            <div className="mt-4 flex flex-col gap-3">
                {popularProducts.map((product) => (
                    <div key={product._id} className="flex hover:no-underline">
                        <div className="w-10 h-10 bg-gray-200 rounded-sm overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={product.image_thumbnail}
                                alt=""
                            />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm text-gray-800">
                                {`Name: ${product.name}`}
                            </p>
                            <span className="text-sm font-medium">
                                {`Sold: ${product.quantity_sold}`}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            {formattedPrice(product.price)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularProducts;
