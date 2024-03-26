const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getCategories,
    getCategoryById,
    getUncategory,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
} = require("../../controllers/category.controller");
const {
    authentication,
    isAdmin,
} = require("../../middlewares/auth.middleware");

// get categories
router.get("/", asyncHandler(getCategories));

// middlewares check authentication
router.use(asyncHandler(authentication));
router.use(asyncHandler(isAdmin));

// get total uncategory products
router.get("/uncategory", asyncHandler(getUncategory));
// get category by id
router.get("/:id", asyncHandler(getCategoryById));
// create category
router.post("/", asyncHandler(createCategory));
// update category
router.post("/:id", asyncHandler(updateCategoryById));
// delete category
router.delete("/:id", asyncHandler(deleteCategoryById));

module.exports = router;
