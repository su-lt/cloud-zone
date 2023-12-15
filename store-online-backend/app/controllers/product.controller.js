const fs = require("fs");
const productModel = require("../models/product.model");
require("../models/productDetail.model");

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
    limit = parseInt(limit) || 30;

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
    // get _id
    const id = req.params.id;
    if (!id) throw new BadRequestError();
    // get product by id
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

const getProductBySlug = async (req, res) => {
    // get _id
    const slug = req.params.slug;
    if (!slug) throw new BadRequestError();
    // get product by slug
    const product = await productModel
        .findOne({ slug })
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
    // get _id
    const id = req.params.id;
    if (!id) throw new BadRequestError();
    // get related products
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
    // get images by multer
    const images = req.files.map((file) => {
        return {
            path: "http://localhost:8088/images/" + file.filename,
            filename: file.filename,
        };
    });
    // create product details
    const productDetails = await productDetailModel.create({
        quantity,
        brand,
        description,
        images,
        color,
    });
    if (!productDetails) throw new CreateDatabaseError();
    // create product
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
    // get images by multer
    const images = req.files.map((file) => {
        return {
            path: "http://localhost:8088/images/" + file.filename,
            filename: file.filename,
        };
    });
    // update product details
    const detail = await productDetailModel.findByIdAndUpdate(productDetail, {
        $push: { images: { $each: images } },
        quantity,
        brand,
        description,
        color,
    });
    if (!detail) throw new CreateDatabaseError();
    // update product
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

    // get product to get images
    const product = await productModel
        .findById(id)
        .populate("productDetail")
        .lean();
    if (!product) throw new BadRequestError();

    // remove images of product from server
    if (product.productDetail.images.length > 0) {
        product.productDetail.images.map((image) => {
            // check existing image
            fs.access(
                "./app/uploads/images/" + image.filename,
                fs.constants.F_OK,
                (err) => {
                    if (err) {
                        return;
                    }
                    // if existed -> remove it
                    fs.unlink(
                        "./app/uploads/images/" + image.filename,
                        (unlinkErr) => {
                            if (unlinkErr) {
                                return;
                            }
                        }
                    );
                }
            );
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

const getPopularProducts = async (req, res) => {
    // count products with active status
    const products = await productModel
        .find({ status: "active" })
        .sort({ quantity_sold: -1 }) // Sort descending
        .limit(5);

    return res.status(200).json({
        message: "success",
        metadata: {
            products,
        },
    });
};

const totalProducts = async (req, res) => {
    // count products with active status
    const count = await productModel
        .find({ status: "active" })
        .countDocuments();

    return res.status(200).json({
        message: "success",
        metadata: {
            count,
        },
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductBySlug,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    totalProducts,
    getPopularProducts,
};
