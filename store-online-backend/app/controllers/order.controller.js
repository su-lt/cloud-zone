const mongoose = require("mongoose");
const orderModel = require("../models/order.model");
require("../models/user.model");

const getOrders = async (req, res) => {
    const orders = await orderModel
        .find()
        .populate({
            path: "user",
            select: "fullname",
        })
        .lean();
    if (!orders) throw new NotFoundError("Cannot load orders");

    return res.status(200).json({
        message: "success",
        metadata: {
            orders,
        },
    });
};

const getOrderById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const order = await orderModel
        .findById(id)
        .populate({
            path: "user",
            select: "fullname",
        })
        .populate({
            path: "items.product",
            select: "name price image_thumbnail", // Chọn các trường bạn muốn lấy từ đối tượng product
        });
    if (!order) throw new NotFoundError("order not found");

    return res.status(200).json({
        message: "success",
        metadata: {
            order,
        },
    });
};

const createOrder = async (req, res) => {
    const { user, address, items, totalPrice } = req.body;
    if (!user && !address && !items && !totalPrice) throw new BadRequestError();

    const order = await orderModel.create({
        code: generateOrderCode(),
        user,
        address,
        items,
        totalPrice,
    });
    if (!order) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            order,
        },
    });
};

const updateOrderById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const { note, status } = req.body;
    console.log(":::::", note, status);
    if (!note && !status) throw new BadRequestError();

    const update = await orderModel.findByIdAndUpdate(
        id,
        { note, status },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            order: update,
        },
    });
};

const deleteOrderById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const result = await orderModel.findByIdAndDelete(id);
    if (!result) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "deleted successfully",
    });
};

function generateOrderCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 8;

    let orderCode = "";
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderCode += characters[randomIndex];
    }

    return orderCode;
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderById,
    deleteOrderById,
};
