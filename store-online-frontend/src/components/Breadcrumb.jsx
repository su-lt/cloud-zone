import { FaAnglesRight } from "react-icons/fa6";

const Breadcrumb = ({ items }) => {
    return (
        <div className="flex flex-wrap mt-2 text-md dark:text-custom-1000">
            {items.map((item, index) =>
                index === items.length - 1 ? (
                    <div className="font-nomal" key={`last-item-${index}`}>
                        {item.label}
                    </div>
                ) : (
                    <div
                        className="flex items-center font-light"
                        key={`item-${item.label}-${index}`}
                    >
                        {item.label}
                        <FaAnglesRight size={12} className="mx-4" />
                    </div>
                )
            )}
        </div>
    );
};

export default Breadcrumb;
