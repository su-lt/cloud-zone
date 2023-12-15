const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const { create } = require("./productDetail.model");
// plugins
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, slug: "name", unique: true },
        price: { type: Number, required: true },
        image_thumbnail: { type: String },
        quantity: { type: Number, default: 0 },
        quantity_sold: { type: Number, default: 0 },
        productDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductDetail",
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

productSchema.pre("find", function (next) {
    this.sort({
        updatedAt: -1,
    });
    next();
});
module.exports = mongoose.model("Product", productSchema);
