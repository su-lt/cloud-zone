import Breadcrumb from "../components/Breadcrumb";
import FilterSection from "../components/FilterSection";
import ProductSection from "../components/Products/ProductSection";

const Products = () => {
    const breadcrumbItems = [
        { label: "Home", link: "/" },
        { label: "Shop", link: "/products" },
        { label: "All products", link: "" },
    ];

    return (
        <main className="p-4 md:mt-10 md:container">
            <Breadcrumb items={breadcrumbItems} />
            <FilterSection />
            <ProductSection />
        </main>
    );
};

export default Products;
