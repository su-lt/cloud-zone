import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/product.slice";
import Pagination from "../Pagination";

const ProductSection = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((slice) => slice.product);

    useEffect(() => {
        // dispatch(fetchProducts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
