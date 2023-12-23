import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import Pagination from "../Pagination";

const ProductSection = () => {
    const { products } = useSelector((slice) => slice.product);

    return (
        <div className="my-4 transition-all ease-linear duration-500">
            <div className="my-4 grid gap-y-5 transition-all ease-in-out duration-1000 sm:gap-x-14 sm:gap-y-10 sm:grid-cols-2 md:gap-x-8 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard item={product} key={product._id} />
                ))}
            </div>
            <Pagination />
        </div>
    );
};

export default ProductSection;
