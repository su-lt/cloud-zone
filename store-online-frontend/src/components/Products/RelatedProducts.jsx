import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRelatedProductById } from "../../redux/slices/product.slice";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ id }) => {
    const dispatch = useDispatch();
    const { relatedProducts } = useSelector((slice) => slice.product);

    useEffect(() => {
        dispatch(fetchRelatedProductById(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="mt-10">
            <h2 className="dark:text-custom-1000">Related Products</h2>
            {/* <div className="my-4 gap-x-4 gap-y-10 grid grid-cols-2 transition-all ease-in-out duration-1000 md:gap-x-8 lg:grid-cols-4"> */}
            <div className="my-4 wrapper-scroll md:grid-flow-row md:grid-cols-2 lg:grid-cols-4 transition-all ease-in-out duration-1000">
                {relatedProducts.map((product) => (
                    <ProductCard item={product} key={product._id} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
