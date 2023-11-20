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
        password: {
            type: String,
            required: true,
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
