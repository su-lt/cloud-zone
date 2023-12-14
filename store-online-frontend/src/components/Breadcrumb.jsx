import { FaAnglesRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
    return (
        <div className="flex text-md">
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
                        <Link to={item.link}>{item.label}</Link>
                        <FaAnglesRight size={12} className="mx-4" />
                    </div>
                )
            )}
        </div>
    );
};

export default Breadcrumb;
