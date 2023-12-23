const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getOrders,
    getOrderById,
    getOrdersByUserId,
    createOrder,
    updateOrderById,
    deleteOrderById,
    totalOrders,
} = require("../../controllers/order.controller");
const {
    authentication,
    isAdmin,
} = require("../../middlewares/auth.middleware");

// check authentication
router.use(asyncHandler(authentication));
// create order
router.post("/", asyncHandler(createOrder));
// get orders by user id
router.get("/profile/:id", asyncHandler(getOrdersByUserId));
// check admin role
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
