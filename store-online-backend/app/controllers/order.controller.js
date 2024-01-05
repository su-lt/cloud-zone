// packages
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const fs = require("fs/promises");
// models
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const voucherModel = require("../models/voucher.model");
require("../models/user.model");
// modules
const { NotFoundError, BadRequestError } = require("../helpers/errorHandler");
const { generateCode } = require("../helpers");

const getOrders = async (req, res) => {
    // get params
    let { searchString, page, limit, status, startDate, endDate } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const skip = (page - 1) * limit;

    // match object
    const orderMatch = {};

    // check search string
    if (searchString) {
        const codeRegex = new RegExp(searchString, "i");
        orderMatch.$or = [
            { code: codeRegex },
            { "user.fullname": codeRegex },
            { address: codeRegex },
        ];
    }

    // check status
    if (status) {
        orderMatch.status = status;
    }

    // check date time
    if (startDate || endDate) {
        orderMatch.createdAt = {};
        if (startDate) {
            orderMatch.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            orderMatch.createdAt.$lte = endOfDay;
        }
    }

    const orders = await orderModel.aggregate([
        {
            $facet: {
                orders: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    { $sort: { createdAt: -1 } },
                    {
                        $match: orderMatch,
                    },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            code: 1,
                            user: { fullname: "$user.fullname" },
                            address: 1,
                            items: 1,
                            totalPrice: 1,
                            status: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ],
                totalOrders: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $match: orderMatch,
                    },
                    { $count: "total" },
                ],
            },
        },
        {
            $project: {
                orders: 1,
                totalOrders: { $arrayElemAt: ["$totalOrders.total", 0] },
            },
        },
    ]);

    return res.status(200).json({
        message: "success",
        metadata: {
            orders: orders[0].orders,
            totalOrders: orders[0].totalOrders,
        },
    });
};

const getOrderById = async (req, res) => {
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // find by _id
    const order = await orderModel
        .findById(id)
        .populate({
            path: "user",
            select: "fullname",
        })
        .populate({
            path: "items.product",
            select: "name price image_thumbnail status", // get fields of product
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
    const { user, address, items, totalPrice, voucherCode } = req.body;
    if (!user && !address && !items && !totalPrice) throw new BadRequestError();

    // check items is array
    if (Array.isArray(items)) {
        for (const item of items) {
            await productModel.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity },
            });
        }
    }

    // create order object
    const orderObject = {
        code: generateCode(),
        user,
        address,
        items,
        totalPrice,
    };

    // check discount exists
    if (voucherCode) {
        const voucher = await voucherModel.findOneAndUpdate(
            { code: voucherCode },
            { status: "used" },
            { new: true }
        );
        if (!voucher) throw new CreateDatabaseError();

        // add discount
        orderObject.discount = voucher.discount;
        orderObject.totalPrice =
            orderObject.totalPrice -
            (orderObject.totalPrice * voucher.discount) / 100;
    }
    // create order
    const order = await orderModel.create(orderObject);
    if (!order) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            order,
        },
    });
};

const updateOrderById = async (req, res) => {
    // get_id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const { note, status } = req.body;
    if (!note && !status) throw new BadRequestError();

    // get order by _id
    const order = await orderModel.findById(id).populate({
        path: "items.product",
        select: "status", // get fields of product
    });
    // update note
    order.note = note;

    // update status
    order.status = status;

    // remove inactive products from the order
    if (status === "shipping" || status === "delivered") {
        order.items = order.items.filter(
            (item) => item.product && item.product.status === "active"
        );
        const totalPrice = order.items.reduce((total, item) => {
            const price = parseInt(item.quantity) * parseInt(item.price);
            return total + price;
        }, 0);
        order.totalPrice = totalPrice;
    }

    // rollback quantity of products
    if (status === "cancel") {
        for (const item of order.items) {
            await productModel.findByIdAndUpdate(item.product._id, {
                $inc: { quantity: item.quantity },
            });
        }
    }

    // increase quantity of sold products
    if (status === "delivered") {
        for (const item of order.items) {
            await productModel.findByIdAndUpdate(item.product._id, {
                $inc: { quantity_sold: item.quantity },
            });
        }
    }

    // update order
    const update = await order.save();
    if (!update) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            order: update,
        },
    });
};

// get orders by user id
const getOrdersByUserId = async (req, res) => {
    // get_id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get orders by user_id
    const orders = await orderModel.find({ user: id });
    if (!orders) throw new NotFoundError();

    return res.status(200).json({
        message: "success",
        metadata: {
            orders: orders,
        },
    });
};

const deleteOrderById = async (req, res) => {
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get order by _id
    const order = await orderModel.findById(id).populate({
        path: "items.product",
        select: "status", // get fields of product
    });
    if (!order) throw new BadRequestError();

    // rollback quantity of products
    for (const item of order.items) {
        await productModel.findByIdAndUpdate(item.product._id, {
            $inc: { quantity: item.quantity },
        });
    }

    // delete order
    const result = await order.deleteOne();
    if (result.deletedCount !== 1) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "deleted successfully",
    });
};

const totalOrders = async (req, res) => {
    // count orders with status != cancel
    const count = await orderModel
        .find({ status: { $ne: "cancel" } })
        .countDocuments();

    const totalPrices = await orderModel
        .find({
            status: { $ne: "cancel" },
        })
        .select("totalPrice")
        .then((orders) =>
            orders.reduce((acc, order) => acc + order.totalPrice, 0)
        );

    return res.status(200).json({
        message: "success",
        metadata: {
            count,
            totalPrices,
        },
    });
};

const exportData = async (req, res) => {
    // get params
    let { searchString, status, startDate, endDate } = req.query;

    // match object
    const orderMatch = {};

    // check search string
    if (searchString) {
        const codeRegex = new RegExp(searchString, "i");
        orderMatch.$or = [
            { code: codeRegex },
            { "user.fullname": codeRegex },
            { address: codeRegex },
        ];
    }

    // check status
    if (status) {
        orderMatch.status = status;
    }

    // check date time
    if (startDate || endDate) {
        orderMatch.createdAt = {};
        if (startDate) {
            orderMatch.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            orderMatch.createdAt.$lte = endOfDay;
        }
    }

    const orders = await orderModel.aggregate([
        {
            $facet: {
                orders: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    { $sort: { createdAt: -1 } },
                    {
                        $match: orderMatch,
                    },
                    {
                        $project: {
                            code: 1,
                            user: { fullname: "$user.fullname" },
                            address: 1,
                            items: 1,
                            totalPrice: 1,
                            status: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                orders: 1,
            },
        },
    ]);

    return res.status(200).json({
        message: "export success",
        metadata: {
            orders: orders[0].orders,
        },
    });
};

module.exports = {
    getOrders,
    getOrderById,
    getOrdersByUserId,
    createOrder,
    updateOrderById,
    deleteOrderById,
    totalOrders,
    exportData,
};
