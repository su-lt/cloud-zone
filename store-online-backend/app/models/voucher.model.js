const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
const voucherSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discount: {
            type: Number,
            enum: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
            default: 5,
        },
        status: {
            type: String,
            enum: ["available", "expired", "used"],
            default: "available",
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Voucher", voucherSchema);
