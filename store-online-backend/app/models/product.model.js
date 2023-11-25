const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        image_thumbnail: {
            type: String,
            required: true,
        },
        quantity_sold: {
            type: Number,
            default: 0,
        },
        productDetail: {
            type: Schema.Types.ObjectId,
            ref: "ProductDetail",
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Product", productSchema);
