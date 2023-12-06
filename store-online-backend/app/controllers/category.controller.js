const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
const {
    NotFoundError,
    BadRequestError,
    CreateDatabaseError,
} = require("../helpers/errorHandler");
const productModel = require("../models/product.model");

const getCategories = async (req, res) => {
    const categories = await categoryModel.find({ deleted_at: null });
    if (!categories) throw new NotFoundError("Cannot load categories");

    return res.status(200).json({
        message: "success",
        metadata: {
            categories,
        },
    });
};

const getCategoryById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const category = await categoryModel.findById(id);
    if (!category) throw new NotFoundError("category not found");

    return res.status(200).json({
        message: "success",
        metadata: {
            category,
        },
    });
};

const createCategory = async (req, res) => {
    const name = req.body.name;
    if (!name) throw new BadRequestError("name is required");

    const category = await categoryModel.create({
        name,
    });
    if (!category) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            category,
        },
    });
};

const updateCategoryById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const name = req.body.name;
    if (!name) throw new BadRequestError("name is required");

    const update = await categoryModel.findByIdAndUpdate(
        id,
        { name },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            category: update,
        },
    });
};
const deleteCategoryById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const result = await categoryModel.findByIdAndUpdate(id, {
        deleted_at: new Date(),
    });
    if (!result) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "deleted successfully",
    });
};

const getTotalProductByCategoryId = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const result = await productModel
        .find({
            category: new mongoose.Types.ObjectId(id),
        })
        .countDocuments();
    if (!result) throw new NotFoundError("Cannot load categories");

    return res.status(200).json({
        message: "success",
        metadata: {
            totalProduct: result,
        },
    });
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
    getTotalProductByCategoryId,
};
