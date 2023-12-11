const { Schema, model } = require("mongoose");

const productDetailSchema = new Schema(
    {
        quantity: { type: Number, required: true },
        brand: { type: String, required: true },
        description: { type: String, required: true },
        images: [
            {
                type: {
                    path: String,
                    filename: String,
                },
            },
        ],
        color: { type: String, default: "none" },
    },
    {
        timestamps: true,
    }
);
module.exports = model("ProductDetail", productDetailSchema);
