const { Schema, model } = require("mongoose");

// Declare the Schema of the Mongo model
var keySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "User",
        },
        publicKey: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: Array,
            default: [], // refresh tokens used
        },
        resetKey: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = model("Key", keySchema);
