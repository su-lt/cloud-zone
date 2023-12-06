import React from "react";

const popularData = [
    {
        id: "1",
        product_id: "123",
        product_name: "product 1",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
    {
        id: "2",
        product_id: "123",
        product_name: "product 2",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
    {
        id: "3",
        product_id: "123",
        product_name: "product 3",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
    {
        id: "4",
        product_id: "123",
        product_name: "product 4",
        product_thumbnail: "https://source.unsplash.com/random/400x300",
        product_price: "234",
        product_stock: "123",
    },
];

const PopularProducts = () => {
    return (
        <div className="p-4 pt-3 w-full min-w-[265px] xl:w-96 bg-white rounded-sm border-gray-200 ">
            <strong className="text-gray-700 font-medium">
                Popular Products
            </strong>
            <div className="mt-4 flex flex-col gap-3">
                {popularData.map((product) => (
                    <div key={product.id} className="flex hover:no-underline">
                        <div className="w-10 h-10 bg-gray-200 rounded-sm overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={product.product_thumbnail}
                                alt=""
                            />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm text-gray-800">
                                {product.product_name}
                            </p>
                            <span className="text-sm font-medium">
                                {product.product_stock}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">
                            $ {product.product_price}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularProducts;
