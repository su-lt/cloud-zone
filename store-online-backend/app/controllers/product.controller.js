const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const productDetail = require("../models/productDetail.model");
const { Types } = require("mongoose");
const { NotFoundError } = require("../helpers/errorHandler");

const getAllProducts = async (req, res) => {
    let { minPrice, maxPrice, page, limit, searchString, searchCategory } =
        req.query;

    minPrice = parseInt(minPrice) || 0;
    maxPrice = parseInt(maxPrice) || 0;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    const skip = (page - 1) * limit;

    const query = productModel.find().skip(skip).limit(limit);
    const countQuery = productModel.find();
    // get product with conditions

    if (minPrice > 0) {
        query.where("price").gt(minPrice);
        countQuery.where("price").gt(minPrice);
    }

    if (maxPrice > 0) {
        query.where("price").lt(maxPrice);
        countQuery.where("price").lt(maxPrice);
    }

    if (searchString) {
        const regex = new RegExp(searchString, "i");
        query.where({ name: regex });
        countQuery.where({ name: regex });
    }

    if (searchCategory) {
        query.find({ category: new Types.ObjectId(searchCategory) });
        countQuery.where({ category: new Types.ObjectId(searchCategory) });
    }

    // get total number of products
    const totalProducts = await countQuery.countDocuments();

    // get products
    const products = await query.lean().exec();

    return res.status(200).json({
        message: "success",
        metadata: {
            products: products,
            totalProducts,
        },
    });
};

const getProductById = async (req, res) => {
    const id = req.params.id;
    if (!id) throw new BadRequestError();

    const product = await productModel
        .findById(id)
        .populate("productDetail")
        .populate("category")
        .lean();
    if (!product) throw new NotFoundError();

    return res.status(200).json({
        message: "success",
        metadata: {
            product,
        },
    });
};

const getRelatedProducts = async (req, res) => {
    const id = req.params.id;
    if (!id) throw new BadRequestError();

    const product = await productModel.findById(id).lean();
    if (!product) throw new NotFoundError();

    const relatedProducts = await productModel
        .find({ category: product.category })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();

    return res.status(200).json({
        message: "success",
        metadata: {
            relatedProducts,
        },
    });
};

const getCategories = async (req, res) => {
    const categories = await categoryModel.find();

    return res.status(200).json({
        message: "success",
        metadata: {
            categories,
        },
    });
};
module.exports = {
    getAllProducts,
    getCategories,
    getProductById,
    getRelatedProducts,
};
