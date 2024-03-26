const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/uploader.middleware");

const asyncHandler = require("../../helpers/asyncHandler");
const {
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
} = require("../../controllers/product.controller");
const {
    authentication,
    isAdmin,
} = require("../../middlewares/auth.middleware");

// get products
router.get("/", asyncHandler(getAllProducts));
// get products
router.get("/orderProducts", asyncHandler(getOrderProducts));
// count products
router.get("/totalProducts", asyncHandler(totalProducts));
// get product
router.get("/:id", asyncHandler(getProductById));
//get product by slug
router.get("/slug/:slug", asyncHandler(getProductBySlug));
// get related products
router.post("/related/:id", asyncHandler(getRelatedProducts));

// check authentication
router.use(asyncHandler(authentication));
router.use(asyncHandler(isAdmin));

// create product
router.post("/", upload.array("images", 10), asyncHandler(createProduct));
// update product
router.put("/:id", upload.array("images", 10), asyncHandler(updateProduct));
// delete product
router.delete("/:id", asyncHandler(deleteProduct));
// remove image
router.delete("/remove/:id", asyncHandler(removeImage));

module.exports = router;
