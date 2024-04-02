import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FilterSection from "../../components/FilterSection";
import ProductSection from "../../components/Products/ProductSection";

const Products = () => {
    const breadcrumbItems = [
        { label: "Home", link: "/" },
        { label: "Shop", link: "/products" },
        { label: "All products", link: "" },
    ];

    const [isVisible, setIsVisible] = useState(false);

    // handle scroll to top button visibility
    window.onscroll = function () {
        if (document.documentElement.scrollTop > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // handle scroll to bottom button click
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <main className="flex-1 dark:text-customer-1000 relative">
            <div className="p-4 md:pt-14 md:container ">
                <Breadcrumb items={breadcrumbItems} />
                <FilterSection />
                <ProductSection />
            </div>

            {/* scroll to top button */}
            {isVisible && (
                <>
                    <button
                        className="fixed z-50 bottom-10 right-10 p-4 border border-custom-300 w-14 h-14 rounded-full shadow-md bg-slate-900 hover:bg-custom-1000 text-white text-lg font-semibold transition-colors duration-300"
                        onClick={scrollToTop}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" />
                        </svg>
                    </button>
                </>
            )}
        </main>
    );
};

export default Products;
