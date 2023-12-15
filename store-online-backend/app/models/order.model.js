const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
    {
        code: { type: String, required: true, unique: true },
        user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        address: { type: String, required: true },
        items: [orderItemSchema],
        totalPrice: { type: Number, required: true },
        note: { type: String },
        status: {
            type: String,
            enum: ["cancel", "pending", "processing", "shipping", "delivered"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.pre("find", function (next) {
    this.sort({
        updatedAt: -1,
    });
    next();
});

//Export the model
module.exports = model("Order", orderSchema);
