const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
const {
    NotFoundError,
    BadRequestError,
    CreateDatabaseError,
} = require("../helpers/errorHandler");
const productModel = require("../models/product.model");

const getCategories = async (req, res) => {
    /** get limit
     * if limit undefined, set limit 0
     */
    let { limit, loadAll } = req.query;
    limit = limit ? +limit : 0;

    // if limit exists, check type
    if (limit && isNaN(limit)) throw new BadRequestError();

    // get params query
    let { searchString, page } = req.query;

    /** check page
     * if page undefined, page = 1
     */
    page = page ? +page : 1;

    // get skip value
    const skip = (page - 1) * limit;

    /** get categories - sorted by update time
     * queryCategories is limit products with conditions
     * countCategories is number of all products with conditions
     */
    const queryCategories = categoryModel.find().skip(skip).limit(limit);
    const countCategories = categoryModel.find();

    /** check loadAll condition
     * if loadAll is true, load all categories
     * else load all categories with name not equal UNCATEGORY
     */
    if (!loadAll) {
        queryCategories.where({ name: { $ne: "UNCATEGORY" } });
        countCategories.where({ name: { $ne: "UNCATEGORY" } });
    }

    // search name condition
    if (searchString) {
        // RegExp - i modifier - case-insenitive match
        const regex = new RegExp(searchString, "i");
        queryCategories.where({ name: regex });
        countCategories.where({ name: regex });
    }

    // get total number of products
    const totalCategories = await countCategories.countDocuments().exec();
    // get products
    const categories = await queryCategories.lean().exec();
    if (!categories) throw new NotFoundError("Cannot load categories");

    /** get total products of category
     * by category _id
     */
    for (const categorie of categories) {
        categorie.totalProduct = await productModel
            .find({
                category: new mongoose.Types.ObjectId(categorie._id),
            })
            .countDocuments();
    }

    // return result
    return res.status(200).json({
        status: "success",
        metadata: {
            categories,
            totalCategories,
        },
    });
};

// count all uncategory products
const getUncategory = async (req, res) => {
    // load uncategory name : UNCATEGORY
    const uncategory = await categoryModel.findOne({ name: "UNCATEGORY" });

    // total uncategory products
    const totalProducts = await productModel
        .find({ category: uncategory._id })
        .countDocuments();
    // return result
    return res.status(200).json({
        status: "success",
        metadata: {
            totalProducts,
        },
    });
};

const getCategoryById = async (req, res) => {
    // get _id - check valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    /** get category by id
     * lean result
     */
    const category = await categoryModel.findById(id).lean();
    if (!category) throw new NotFoundError("category not found");

    // return category
    return res.status(200).json({
        status: "success",
        metadata: {
            category,
        },
    });
};

const createCategory = async (req, res) => {
    // get new category name - check null
    const { name } = req.body;
    if (!name) throw new BadRequestError("name is required");

    /** create new category
     */
    const category = await categoryModel.create({
        name,
    });
    if (!category) throw new CreateDatabaseError();

    // return new category
    return res.status(201).json({
        status: "success",
        metadata: {
            category,
        },
    });
};

const updateCategoryById = async (req, res) => {
    // get _id - check valid id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get name to update - check null
    const { name } = req.body;
    if (!name) throw new BadRequestError("name is required");

    /**
     * update category by id
     * return update result category
     * */
    const update = await categoryModel.findByIdAndUpdate(
        id,
        { name },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    // return update category
    return res.status(200).json({
        status: "success",
        metadata: {
            category: update,
        },
    });
};

const deleteCategoryById = async (req, res) => {
    // get _id - check valid id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    /** soft delete category
     * set delete time
     * set isDeleted = true
     */
    const result = await categoryModel.findByIdAndUpdate(id, {
        deletedAt: new Date(),
        isDeleted: true,
    });
    if (!result) throw new CreateDatabaseError();

    /** update products
     * change current category -> uncategory
     */
    const uncategory = await categoryModel.findOne({
        name: "UNCATEGORY",
    });
    await productModel.updateMany(
        { category: id },
        { category: uncategory._id }
    );

    // return successfull
    return res.status(200).json({
        status: "success",
    });
};

module.exports = {
    getCategories,
    getCategoryById,
    getUncategory,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
};
