const productModel = require("../models/product.model");
// const categoryModel = require("../models/category.model");
require("../models/productDetail.model");
const cloudinary = require("../configs/cloudinary.config");

const { Types } = require("mongoose");
const {
    NotFoundError,
    CreateDatabaseError,
    BadRequestError,
} = require("../helpers/errorHandler");
const productDetailModel = require("../models/productDetail.model");

const getAllProducts = async (req, res) => {
    let {
        minPrice,
        maxPrice,
        page,
        limit,
        searchString,
        searchCategory,
        defaultConfig = "true",
    } = req.query;

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

    if (defaultConfig === "true") {
        query.where("status").equals("active");
        countQuery.countDocuments({ status: "active" });
    }

    // get total number of products
    const totalProducts = await countQuery.exec();

    // get products
    const products = await query.lean().exec();

    return res.status(200).json({
        message: "success",
        metadata: {
            products,
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

    const relatedProducts = await productModel
        .find({ category: id })
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

const createProduct = async (req, res) => {
    const { name, price, category, quantity, brand, description } = req.body;
    const color = req.body.color || "none";
    const images = req.files.map((file) => {
        return {
            path: file.path,
            filename: file.filename,
        };
    });

    const productDetails = await productDetailModel.create({
        quantity,
        brand,
        description,
        images,
        color,
    });
    if (!productDetails) throw new CreateDatabaseError();

    const product = await productModel.create({
        name,
        price,
        image_thumbnail: productDetails.images[0]?.path,
        productDetail: productDetails._id,
        category: new Types.ObjectId(category),
    });
    if (!product) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            product,
        },
    });
};

const updateProduct = async (req, res) => {
    const id = req.params.id;
    if (!id) throw new BadRequestError();

    const {
        name,
        price,
        category,
        quantity,
        brand,
        description,
        status,
        productDetail,
    } = req.body;
    const color = req.body.color || "none";
    const images = req.files.map((file) => {
        return {
            path: file.path,
            filename: file.filename,
        };
    });

    detail = await productDetailModel.findByIdAndUpdate(productDetail, {
        $push: { images: { $each: images } },
        quantity,
        brand,
        description,
        color,
    });
    if (!detail) throw new CreateDatabaseError();

    const product = await productModel.findByIdAndUpdate(
        id,
        {
            name,
            price,
            image_thumbnail: detail.images[0]?.path,
            category: new Types.ObjectId(category),
            status,
        },
        { new: true }
    );
    if (!product) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            product,
        },
    });
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    if (!id) throw new BadRequestError();

    const product = await productModel
        .findById(id)
        .populate("productDetail")
        .lean();
    if (!product) throw new BadRequestError();

    if (product.productDetail.images.length > 0) {
        product.productDetail.images.map((image) => {
            cloudinary.uploader.destroy(image.filename);
        });
    }

    const detail = await productDetailModel.findByIdAndDelete(
        product.productDetail._id
    );
    if (!detail) throw new CreateDatabaseError();

    const deleteProduct = await productModel.findByIdAndDelete(id);
    if (!deleteProduct) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
    });
};

// const getCategories = async (req, res) => {
//     const categories = await categoryModel.find();

//     return res.status(200).json({
//         message: "success",
//         metadata: {
//             categories,
//         },
//     });
// };
module.exports = {
    getAllProducts,
    // getCategories,
    getProductById,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
