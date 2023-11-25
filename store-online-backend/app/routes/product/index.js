const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getAllProducts,
    getCategories,
    getProductById,
    getRelatedProducts,
} = require("../../controllers/product.controller");

// get products
router.get("/", asyncHandler(getAllProducts));

// get product
router.post("/:id", asyncHandler(getProductById));

// get categories
router.get("/categories", asyncHandler(getCategories));

// get related products
router.post("/related/:id", asyncHandler(getRelatedProducts));

module.exports = router;
