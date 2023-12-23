const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "deleted"],
            default: "active",
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
