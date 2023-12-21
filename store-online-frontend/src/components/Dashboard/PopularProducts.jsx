import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/product.slice";
import { formattedPrice } from "../../helpers/ultil";

const PopularProducts = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((slice) => slice.product);

    useEffect(() => {
        // dispatch(fetchPopularProducts());
        dispatch(fetchProducts({ sort: "bestseller", limit: 9 }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="p-4 pt-3 w-full min-w-[265px] xl:w-96 bg-white rounded-sm border-gray-200 ">
            <strong className="text-gray-700 font-medium">
                Popular Products
            </strong>
            <div className="mt-4 flex flex-col gap-3">
                {products.map((product) => (
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
