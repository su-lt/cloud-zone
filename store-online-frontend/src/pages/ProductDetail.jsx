import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Product from "../components/Products/Product";
import RelatedProducts from "../components/Products/RelatedProducts";
import { fetchProductById } from "../redux/slices/product.slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { product } = useSelector((slice) => slice.product);
    const { productId } = useParams();

    const breadcrumbItems = product
        ? [
              { label: "Home", link: "/" },
              { label: "Shop", link: "/products" },
              {
                  label: product.category.name,
                  link: `/category/${product.category.name}`,
              },
              { label: product.name, link: "" },
          ]
        : null;

    useEffect(() => {
        dispatch(fetchProductById(productId));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    return (
        product && (
            <main className="p-4 md:container">
                <Breadcrumb items={breadcrumbItems} />
                <Product product={product} />
                <RelatedProducts id={product.category._id} />
            </main>
        )
    );
};

export default ProductDetail;
