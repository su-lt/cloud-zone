const fs = require("fs");
const productModel = require("../models/product.model");
require("../models/productDetail.model");
const { baseUrl } = require("../configs");
const { Types } = require("mongoose");
const {
    NotFoundError,
    CreateDatabaseError,
    BadRequestError,
} = require("../helpers/errorHandler");
const productDetailModel = require("../models/productDetail.model");

const getAllProducts = async (req, res) => {
    // get params
    let {
        minPrice,
        maxPrice,
        page,
        searchString,
        searchCategory,
        sort,
        limit,
        defaultConfig,
    } = req.query;

    // check variable product
    minPrice = parseInt(minPrice) || 0;
    maxPrice = parseInt(maxPrice) || 0;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 4;

    const skip = (page - 1) * limit;
    const query = productModel.find().skip(skip).limit(limit);
    const countQuery = productModel.find();

    // get product with conditions
    // min price condition
    if (minPrice > 0) {
        query.where("price").gt(minPrice);
        countQuery.where("price").gt(minPrice);
    }
    // max price condition
    if (maxPrice > 0) {
        query.where("price").lt(maxPrice);
        countQuery.where("price").lt(maxPrice);
    }
    // search name condition
    if (searchString) {
        const regex = new RegExp(searchString, "i");
        query.where({ name: regex });
        countQuery.where({ name: regex });
    }
    // categories search condition
    if (searchCategory) {
        // split into categories
        const categories = searchCategory.split(",");
        // find by categories
        query.find({ category: { $in: categories } });
        countQuery.where({ category: { $in: categories } });
    }
    // sort
    if (sort) {
        switch (sort) {
            case "latest":
                query.sort({ updatedAt: -1 });
                break;
            case "oldest":
                query.sort({ updatedAt: 1 });
                break;
            case "bestseller":
                query.sort({ quantity_sold: -1 });
                break;
            case "htl":
                query.sort({ price: -1 });
                break;
            case "lth":
                query.sort({ price: 1 });
                break;
            default:
                break;
        }
    }

    if (!defaultConfig) {
        query.where("status").equals("active");
        countQuery.where("status").equals("active");
    }

    // get total number of products
    const totalProducts = await countQuery.countDocuments().exec();

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
    // get slug
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

    // get images by multer
    const images = req.files.map((file) => {
        return {
            path: `${baseUrl}/images/` + file.filename,
            filename: file.filename,
        };
    });
    // create product details
    const productDetails = await productDetailModel.create({
        brand,
        description,
        images,
    });
    if (!productDetails) throw new CreateDatabaseError();
    // create product
    const product = await productModel.create({
        name,
        price,
        quantity,
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
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

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
    // get images by multer
    const images = req.files.map((file) => {
        return {
            path: `${baseUrl}/images/` + file.filename,
            filename: file.filename,
        };
    });
    // update product details
    const detail = await productDetailModel.findByIdAndUpdate(productDetail, {
        $push: { images: { $each: images } },
        brand,
        description,
    });
    if (!detail) throw new CreateDatabaseError();
    // update product
    const product = await productModel.findByIdAndUpdate(
        id,
        {
            name,
            price,
            image_thumbnail: detail.images[0]?.path,
            quantity,
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
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

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

const removeImage = async (req, res) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id))
        throw new BadRequestError("Id not valid !");

    const { filename } = req.query;
    if (!filename) throw new BadRequestError();

    // remove image of product from server
    // check existing image
    fs.access("./app/uploads/images/" + filename, fs.constants.F_OK, (err) => {
        if (err) {
            throw new NotFoundError();
        }
        // if existed -> remove it
        fs.unlink("./app/uploads/images/" + filename, async (unlinkErr) => {
            if (unlinkErr) {
                throw new BadRequestError();
            }

            // remove file suceess
            // remove log db
            await productDetailModel.findByIdAndUpdate(id, {
                $pull: { images: { filename } },
            });

            return res.status(200).json({
                message: "remove image successfully",
            });
        });
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
    removeImage,
};
