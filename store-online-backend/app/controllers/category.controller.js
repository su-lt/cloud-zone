const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
const {
    NotFoundError,
    BadRequestError,
    CreateDatabaseError,
} = require("../helpers/errorHandler");
const productModel = require("../models/product.model");

const getCategories = async (req, res) => {
    // get params
    let { searchString, page } = req.query;
    page = parseInt(page) || 1;

    // set limit product
    const limit = 12;
    const skip = (page - 1) * limit;

    // get all categories sorted by update time
    const query = categoryModel
        .find({ isDeleted: false })
        .skip(skip)
        .limit(limit);
    const countQuery = categoryModel.find({ isDeleted: false });

    // search name condition
    if (searchString) {
        const regex = new RegExp(searchString, "i");
        query.where({
            name: regex,
        });
        countQuery.where({
            name: regex,
        });
    }

    // get total number of products
    const totalCategories = await countQuery.countDocuments().exec();
    // get products
    const categories = await query.lean().exec();
    if (!categories) throw new NotFoundError("Cannot load categories");

    return res.status(200).json({
        message: "success",
        metadata: {
            categories,
            totalCategories,
        },
    });
};

const getCategoryById = async (req, res) => {
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get category by id
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

    // create a new category
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
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const name = req.body.name;
    if (!name) throw new BadRequestError("name is required");

    // update category
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
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // soft delete category
    const result = await categoryModel.findByIdAndUpdate(id, {
        deletedAt: new Date(),
        isDeleted: true,
    });
    if (!result) throw new CreateDatabaseError();

    // update products -> change status to inactive
    await productModel.updateMany(
        { category: id },
        { status: "inactive", category: null }
    );

    return res.status(200).json({
        message: "deleted successfully",
    });
};

const getTotalProductByCategoryId = async (req, res) => {
    // get _id category
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // count total products of this category
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
