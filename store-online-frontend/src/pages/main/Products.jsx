import Breadcrumb from "../../components/Breadcrumb";
import FilterSection from "../../components/FilterSection";
import ProductSection from "../../components/Products/ProductSection";

const Products = () => {
    const breadcrumbItems = [
        { label: "Home", link: "/" },
        { label: "Shop", link: "/products" },
        { label: "All products", link: "" },
    ];

    return (
        <main className="dark:bg-dark dark:text-customer-1000">
            <div className="p-4 md:pt-14 md:container ">
                <Breadcrumb items={breadcrumbItems} />
                <FilterSection />
                <ProductSection />
            </div>
        </main>
    );
};

export default Products;
