import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearState, fetchProducts } from "../../redux/slices/product.slice";
import ProductCard from "./ProductCard";

const PopularProducts = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((slice) => slice.product);

    useEffect(() => {
        dispatch(fetchProducts({ sort: "bestseller", limit: 4 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearState());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-10">
            <h2 className="dark:text-custom-1000">Popular Products</h2>
            <div className="my-4 wrapper-scroll md:grid-flow-row md:grid-cols-2 lg:grid-cols-4 transition-all ease-in-out duration-1000">
                {products.map((product) => (
                    <ProductCard item={product} key={product._id} />
                ))}
            </div>
        </div>
    );
};

export default PopularProducts;
