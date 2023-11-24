const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const { Types } = require("mongoose");

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
    const products = await query.exec();

    return res.status(200).json({
        message: "success",
        metadata: {
            products: products,
            totalProducts,
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
};
