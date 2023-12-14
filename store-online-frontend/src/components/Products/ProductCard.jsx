import { FaRegHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { formattedPrice } from "../../helpers/ultil";

const ProductCard = ({ item }) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="w-full h-[400px] lg:h-[340px] xl:h-[360px] cursor-pointer">
                <Link to={`/products/${item.slug}`}>
                    <img
                        src={`${item.image_thumbnail}`}
                        alt=""
                        className="w-full h-full object-cover rounded-lg shrink-0"
                    />
                </Link>
            </div>
            <div className="mx-1 flex justify-between text-gray3 text-sm">
                <span className="cursor-pointer">
                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                </span>
                <span>
                    <FaRegHeart size={14} />
                </span>
            </div>
            <div className="mx-1 flex justify-between text-gray2 text-sm">
                <span>Price: {formattedPrice(item.price)}</span>
                <span>Sold: {item.quantity_sold}</span>
            </div>
        </div>
    );
};

export default ProductCard;
