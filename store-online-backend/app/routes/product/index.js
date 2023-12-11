const express = require("express");
const router = express.Router();
const uploadCloud = require("../../middlewares/uploader");

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getAllProducts,
    getProductById,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../../controllers/product.controller");

// get products
router.get("/", asyncHandler(getAllProducts));

// get product
router.get("/:id", asyncHandler(getProductById));

// create product
router.post("/", uploadCloud.array("images", 10), asyncHandler(createProduct));

// update product
router.put(
    "/:id",
    uploadCloud.array("images", 10),
    asyncHandler(updateProduct)
);

// delete product
router.delete("/:id", asyncHandler(deleteProduct));

// get categories
// router.get("/categories", asyncHandler(getCategories));

// get related products
router.post("/related/:id", asyncHandler(getRelatedProducts));

module.exports = router;
