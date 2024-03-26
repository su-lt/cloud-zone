const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
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

categorySchema.pre("find", function () {
    this.where({ isDeleted: false });
});
categorySchema.pre("countDocuments", function () {
    this.where({ isDeleted: false });
});

module.exports = model("Category", categorySchema);
