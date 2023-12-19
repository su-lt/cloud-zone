const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderById,
    deleteOrderById,
    totalOrders,
} = require("../../controllers/order.controller");
const {
    authentication,
    isAdmin,
} = require("../../middlewares/auth.middleware");

// create order
router.post("/", asyncHandler(createOrder));

// check authentication
router.use(asyncHandler(authentication));
router.use(asyncHandler(isAdmin));

// get orders
router.get("/", asyncHandler(getOrders));

// get total orders
router.get("/totalOrder", asyncHandler(totalOrders));

// get order by id
router.get("/:id", asyncHandler(getOrderById));

// update order
router.patch("/:id", asyncHandler(updateOrderById));

// delete order
router.delete("/:id", asyncHandler(deleteOrderById));

module.exports = router;
