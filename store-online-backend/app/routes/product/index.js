const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getAllProducts,
    getCategories,
} = require("../../controllers/product.controller");

// get products
router.post("/products", asyncHandler(getAllProducts));

// get categories
router.post("/categories", asyncHandler(getCategories));

module.exports = router;
