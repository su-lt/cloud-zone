const fs = require("fs");
const { Types } = require("mongoose");
const {
    server: { url, port },
} = require("../configs");
const productModel = require("../models/product.model");
const productDetailModel = require("../models/productDetail.model");
const {
    NotFoundError,
    CreateDatabaseError,
    BadRequestError,
} = require("../helpers/errorHandler");
const categoryModel = require("../models/category.model");

const getAllProducts = async (req, res) => {
    // get limit - check limit null or NaN
    let { limit } = req.query;
    limit = limit ? +limit : 0;
    // if limit exists, check type
    if (isNaN(limit)) throw new BadRequestError();

    // get query params
    let {
        minPrice,
        maxPrice,
        page,
        searchString,
        searchCategory,
        status,
        sort,
        defaultConfig,
    } = req.query;

    /** check page
     * if page undefined, page = 1
     */
    page = page ? +page : 1;
    // if limit page, check type
    if (isNaN(page)) throw new BadRequestError();

    // get skip value
    const skip = (page - 1) * limit;

    /** get products
     * queryProducts is limit products with conditions
     * countProducts is number of all products with conditions
     */
    const queryProducts = productModel
        .find()
        .skip(skip)
        .limit(+limit)
        .populate("category");
    const countProducts = productModel.find();

    // get product with conditions
    // min price condition
    if (+minPrice > 0) {
        queryProducts.where("price").gt(+minPrice);
        countProducts.where("price").gt(+minPrice);
    }
    // max price condition
    if (+maxPrice > 0) {
        queryProducts.where("price").lt(+maxPrice);
        countProducts.where("price").lt(+maxPrice);
    }
    // search name condition
    if (searchString) {
        const regex = new RegExp(searchString, "i");
        queryProducts.where({ name: regex });
        countProducts.where({ name: regex });
    }
    // categories search condition
    if (searchCategory) {
        // split into categories
        const categories = searchCategory.split(",");
        // find by categories
        queryProducts.find({ category: { $in: categories } });
        countProducts.where({ category: { $in: categories } });
    }
    // status search condition
    if (status) {
        // find by status
        queryProducts.find({ status });
        countProducts.where({ status });
    }

    /** sort conditions
     * sort products by condition:
     * latest, oldest, bestseller,
     * price hight to low and price low to high
     */
    if (sort) {
        switch (sort) {
            // sort by newest
            case "latest":
                queryProducts.sort({ updatedAt: -1 });
                break;
            // sort by oldest
            case "oldest":
                queryProducts.sort({ updatedAt: 1 });
                break;
            // sort by bestseller
            case "bestseller":
                queryProducts.sort({ quantity_sold: -1 });
                break;
            // sort by price hight to low
            case "htl":
                queryProducts.sort({ price: -1 });
                break;
            // sort by price low to high
            case "lth":
                queryProducts.sort({ price: 1 });
                break;
            default:
                break;
        }
    }

    /** defaultConfig
     *  the default configuration for active products and not uncategory
     *  defaultConfig = true -> for all products
     */
    if (!defaultConfig) {
        const uncategory = await categoryModel.findOne({
            name: "UNCATEGORY",
        });
        queryProducts
            .where({ status: "active" })
            .where({ category: { $ne: uncategory._id } });
        countProducts
            .where({ status: "active" })
            .where({ category: { $ne: uncategory._id } });
    }

    // get products
    const products = await queryProducts.lean().exec();

    // get total number of products
    const totalProducts = await countProducts.countDocuments().exec();

    // return products and total products
    return res.status(200).json({
        status: "success",
        metadata: {
            products,
            totalProducts,
        },
    });
};

const getOrderProducts = async (req, res) => {
    // get query params
    let { page, searchString } = req.query;

    /** check page
     * if page undefined, page = 1
     */
    page = page ? +page : 1;

    // get limit - check limit null or NaN
    let { limit } = req.query;
    limit = limit ? +limit * page : 0;

    // if limit exists, check type
    if (!limit || isNaN(limit)) throw new BadRequestError();

    /** get products
     * queryProducts is limit products with conditions
     * countProducts is number of all products with conditions
     */
    const queryProducts = productModel.find().limit(limit).populate("category");
    const countProducts = productModel.find();

    // search name condition
    if (searchString) {
        const regex = new RegExp(searchString, "i");
        queryProducts.where({ name: regex });
        countProducts.where({ name: regex });
    }

    // get products
    const products = await queryProducts.lean().exec();

    // get total number of products
    const totalProducts = await countProducts.countDocuments().exec();

    // return products and total products
    return res.status(200).json({
        status: "success",
        metadata: {
            products,
            totalProducts,
        },
    });
};

const getProductById = async (req, res) => {
    // get _id - check null
    const id = req.params.id;
    if (!id) throw new BadRequestError();

    /** get product by id
     * populate product details
     * lean result
     */
    const product = await productModel
        .findById(id)
        .populate("productDetail")
        .lean();
    if (!product) throw new NotFoundError();

    // return product
    return res.status(200).json({
        status: "success",
        metadata: {
            product,
        },
    });
};

const getProductBySlug = async (req, res) => {
    // get slug - check null
    const slug = req.params.slug;
    if (!slug) throw new BadRequestError();

    /** get product by slug
     * populate product details
     * populate category
     * lean result
     */
    const product = await productModel
        .findOne({ slug })
        .populate("productDetail")
        .populate("category")
        .lean();
    if (!product) throw new NotFoundError("404");

    // return product
    return res.status(200).json({
        status: "success",
        metadata: {
            product,
        },
    });
};

const getRelatedProducts = async (req, res) => {
    // get _id - chekc null
    const id = req.params.id;
    if (!id) throw new BadRequestError();

    /** get related products by category id
     * sort newest
     * limit 4 products
     * lean result
     */
    const relatedProducts = await productModel
        .find({ category: id })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();

    // retun products
    return res.status(200).json({
        status: "success",
        metadata: {
            relatedProducts,
        },
    });
};

const createProduct = async (req, res) => {
    // get body params - check null
    const { name, price, category, quantity, brand, description } = req.body;
    if (!name || !price || !category || !brand || !description)
        throw new BadRequestError();

    /** check price
     * price is exist
     * price must be a number
     */
    if (isNaN(price)) throw new BadRequestError();

    /** check quantity
     * if quantity exist, quantity must be a number
     */
    if (quantity && isNaN(quantity)) throw new BadRequestError();

    // check images in multer
    let images = req.files;
    if (!images) images = [];

    /** get images by multer
     * upload to folder /uploads/images
     * get filename to path
     */
    images = images.map((file) => {
        return {
            path: `${url}:${port}/images/` + file.filename,
            filename: file.filename,
        };
    });

    /** create product detail
     * get _id product detail for product
     * 1 product : 1 product detail
     */
    const productDetails = await productDetailModel.create({
        brand,
        description,
        images,
    });
    if (!productDetails) throw new CreateDatabaseError();

    /** create product
     * image_thumbnail is first image
     */
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
        status: "success",
        metadata: {
            product,
        },
    });
};

const updateProduct = async (req, res) => {
    // get id - check valid
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get body params - check null
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
    if (
        !name ||
        !price ||
        !category ||
        !brand ||
        !description ||
        !status ||
        !productDetail
    )
        throw new BadRequestError();

    /** check price
     * price is exist
     * price must be a number
     */
    if (isNaN(price)) throw new BadRequestError();

    /** check quantity
     * if quantity exist, quantity must be a number
     */
    if (quantity && isNaN(quantity)) throw new BadRequestError();

    // check images in multer
    let images = req.files;
    if (!images) images = [];

    /** get images by multer
     * upload to folder /uploads/images
     * get filename to path
     */
    images = images.map((file) => {
        return {
            path: `${url}:${port}/images/` + file.filename,
            filename: file.filename,
        };
    });

    //
    /** update product details by product detail id
     * if images is exist, push more
     * update brand
     * update description
     */
    const detail = await productDetailModel.findByIdAndUpdate(productDetail, {
        $push: { images: { $each: images } },
        brand,
        description,
    });
    if (!detail) throw new CreateDatabaseError();

    /** update product
     * update image_thumbnail is first image
     * return new result
     */
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

    // return upudate product
    return res.status(200).json({
        status: "success",
        metadata: {
            product,
        },
    });
};

const deleteProduct = async (req, res) => {
    // get id - check valid
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    /** get product by id
     * populate product detail
     * lean result
     */
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

    // delete product detail by id
    const detail = await productDetailModel.findByIdAndDelete(
        product.productDetail._id
    );
    if (!detail) throw new CreateDatabaseError();

    // delete product
    const deleteProduct = await productModel.findByIdAndDelete(id);
    if (!deleteProduct) throw new CreateDatabaseError();

    // return successfull
    return res.status(200).json({
        status: "success",
    });
};

const totalProducts = async (req, res) => {
    // count total products with active status
    const total = await productModel
        .find({ status: "active" })
        .countDocuments();

    // return total products
    return res.status(200).json({
        status: "success",
        metadata: {
            total,
        },
    });
};

const removeImage = async (req, res) => {
    // get id - check valid
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id))
        throw new BadRequestError("Id not valid !");

    // get filename image - check null
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

            // return successfull
            return res.status(200).json({
                message: "remove image successfully",
            });
        });
    });
};

module.exports = {
    getAllProducts,
    getOrderProducts,
    getProductById,
    getProductBySlug,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    totalProducts,
    removeImage,
};
