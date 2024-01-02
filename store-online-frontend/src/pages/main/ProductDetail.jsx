import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Product from "../../components/Products/Product";
import RelatedProducts from "../../components/Products/RelatedProducts";
import { fetchProductBySlug, setError } from "../../redux/slices/product.slice";
import { useDispatch, useSelector } from "react-redux";

const ProductDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, error } = useSelector((slice) => slice.product);
    const { slug } = useParams();

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
        if (error === "404") {
            dispatch(setError());
            navigate("/404");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    useEffect(() => {
        dispatch(fetchProductBySlug(slug));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    return (
        product && (
            <main className="flex-1">
                <div className="p-4 md:mt-10 md:container">
                    <Breadcrumb items={breadcrumbItems} />
                    <Product product={product} />
                    <RelatedProducts id={product.category._id} />
                </div>
            </main>
        )
    );
};

export default ProductDetail;
