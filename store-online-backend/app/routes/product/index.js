const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/uploader");

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getAllProducts,
    getProductById,
    getProductBySlug,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../../controllers/product.controller");

// get products
router.get("/", asyncHandler(getAllProducts));

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
