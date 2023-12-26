const { Schema, model } = require("mongoose");

const productDetailSchema = new Schema(
    {
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
    },
    {
        timestamps: true,
    }
);
module.exports = model("ProductDetail", productDetailSchema);
