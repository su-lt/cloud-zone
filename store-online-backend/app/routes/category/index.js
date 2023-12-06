const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
    getTotalProductByCategoryId,
} = require("../../controllers/category.controller");

// get categories
router.get("/", asyncHandler(getCategories));

// get category by id
router.get("/:id", asyncHandler(getCategoryById));

// create category
router.post("/", asyncHandler(createCategory));

// update category
router.post("/:id", asyncHandler(updateCategoryById));

// delete category
router.delete("/:id", asyncHandler(deleteCategoryById));

// get dependent products
router.get("/dependence/:id", asyncHandler(getTotalProductByCategoryId));

module.exports = router;
