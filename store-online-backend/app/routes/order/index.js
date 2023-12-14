const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderById,
    deleteOrderById,
} = require("../../controllers/order.controller");

// get categories
router.get("/", asyncHandler(getOrders));

// get category by id
router.get("/:id", asyncHandler(getOrderById));

// create category
router.post("/", asyncHandler(createOrder));

// update category
router.patch("/:id", asyncHandler(updateOrderById));

// delete category
router.delete("/:id", asyncHandler(deleteOrderById));

module.exports = router;