const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/uploader.middleware");

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getAllProducts,
    getProductById,
    getProductBySlug,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    totalProducts,
    getPopularProducts,
} = require("../../controllers/product.controller");
const { authentication } = require("../../middlewares/auth.middleware");

// get products
router.get("/", asyncHandler(getAllProducts));

// count products
router.get("/totalProducts", asyncHandler(totalProducts));

// get popular products
router.get("/popularProducts", asyncHandler(getPopularProducts));

// get product
router.get("/:id", asyncHandler(getProductById));

//get product by slug
router.get("/slug/:slug", asyncHandler(getProductBySlug));

// create product
router.post("/", upload.array("images", 10), asyncHandler(createProduct));

// update product
router.put("/:id", upload.array("images", 10), asyncHandler(updateProduct));

// delete product
router.delete("/:id", asyncHandler(deleteProduct));

// get categories
// router.get("/categories", asyncHandler(getCategories));

// get related products
router.post("/related/:id", asyncHandler(getRelatedProducts));

module.exports = router;
