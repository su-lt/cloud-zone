import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Product from "../components/Products/Product";
import RelatedProducts from "../components/Products/RelatedProducts";

const ProductDetail = () => {
    const breadcrumbItems = [
        { label: "Home", link: "/" },
        { label: "Shop", link: "/products" },
        { label: "Product detail", link: "" },
    ];

    const { productId } = useParams();

    return (
        <main className="p-4 md:container">
            <Breadcrumb items={breadcrumbItems} />
            <Product id={productId} />
            <RelatedProducts id={productId} />
        </main>
    );
};

export default ProductDetail;
