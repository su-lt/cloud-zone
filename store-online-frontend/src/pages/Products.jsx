import Breadcrumb from "../components/Breadcrumb";
import FilterSection from "../components/FilterSection";
import ProductSection from "../components/Product";

const Products = () => {
    const breadcrumbItems = [
        { label: "Home", link: "/" },
        { label: "Shop", link: "/products" },
        { label: "Men's", link: "/products" },
    ];

    return (
        <div className="p-4 md:container">
            <Breadcrumb items={breadcrumbItems} />
            <FilterSection />
            <ProductSection />
        </div>
    );
};

export default Products;
