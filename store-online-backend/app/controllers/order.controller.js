// packages
const mongoose = require("mongoose");
// models
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const voucherModel = require("../models/voucher.model");
require("../models/user.model");
// modules
const { NotFoundError, BadRequestError } = require("../helpers/errorHandler");
const { generateCode, log } = require("../helpers");

const getOrders = async (req, res) => {
    /** get limit
     * if limit undefined, set limit 0
     */
    let { limit } = req.query;
    limit = limit ? +limit : 0;

    // if limit exists, check type
    if (limit && isNaN(limit)) throw new BadRequestError();

    // get params query
    let { searchString, page, status, startDate, endDate } = req.query;

    /** check page
     * if page undefined, page = 1
     */
    page = page ? +page : 1;

    // get skip value
    const skip = (page - 1) * limit;

    // match object
    const orderMatch = {};

    // check search string condition
    if (searchString) {
        const codeRegex = new RegExp(searchString, "i");
        orderMatch.$or = [
            { code: codeRegex },
            { "user.fullname": codeRegex },
            { address: codeRegex },
        ];
    }

    // check status condition
    if (status) {
        orderMatch.status = status;
    }

    // check date time condition
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

    /** get orders - sorted by update time - join table to check conditions
     * orders is limit products with conditions
     */
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
                    ...(limit > 0 ? [{ $skip: skip }, { $limit: limit }] : []),
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

    // return orders - total orders
    return res.status(200).json({
        status: "success",
        metadata: {
            orders: orders[0].orders,
            totalOrders: orders[0].totalOrders,
        },
    });
};

const getOrderById = async (req, res) => {
    // get _id
    const id = req.params.id;
    // check valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    /** find order by _id
     * populate user get fullname
     * populate item.product get name, price, image thumbnail, status
     */
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
    // check error
    if (!order) throw new NotFoundError("order not found");

    // return order
    return res.status(200).json({
        status: "success",
        metadata: {
            order,
        },
    });
};

const createOrder = async (req, res) => {
    // get request params
    const { user, address, items, totalPrice, voucherCode, note } = req.body;
    // check null
    if (!user && !address && !totalPrice) throw new BadRequestError();

    // check user id valid
    if (!mongoose.Types.ObjectId.isValid(user)) {
        throw new BadRequestError("User id not valid !");
    }

    // check price - must be a number
    if (isNaN(totalPrice))
        throw new BadRequestError("totalPrice must be a number");

    // check items is array
    if (!Array.isArray(items)) throw new BadRequestError("Items cannot null");

    /**
     * if items exists, check item to reduce the amount of quantity products
     */
    for (const item of items) {
        await productModel.findByIdAndUpdate(item.product, {
            $inc: { quantity: -item.quantity },
        });
    }

    /** create new order object
     * auto generate order code
     */
    const orderObject = {
        code: generateCode(),
        user,
        address,
        items,
        totalPrice,
        note,
    };

    // check discount exists
    if (voucherCode) {
        // if exist, change status voucher to used
        const voucher = await voucherModel.findOneAndUpdate(
            { code: voucherCode },
            { status: "used" },
            { new: true }
        );
        // check error
        if (!voucher) throw new CreateDatabaseError();

        // add discount amount
        orderObject.discount = voucher.discount;
        orderObject.totalPrice =
            orderObject.totalPrice -
            (orderObject.totalPrice * voucher.discount) / 100;
    }

    // create new order
    const order = await orderModel.create(orderObject);
    // check error
    if (!order) throw new CreateDatabaseError();

    // return created order
    return res.status(200).json({
        status: "success",
        metadata: {
            order,
        },
    });
};

const updateOrderById = async (req, res) => {
    // get_id
    const id = req.params.id;
    // check valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get request params
    const { note, status } = req.body;
    // check status
    if (!status) throw new BadRequestError();

    /** get order by _id
     * populate item product get status
     */
    const order = await orderModel.findById(id).populate({
        path: "items.product",
        select: "status", // get fields of product
    });

    // update status
    order.status = status;
    // check note exist
    if (note)
        // update note
        order.note = note;

    // remove inactive products from the order
    if (status === "shipping" || status === "delivered") {
        order.items = order.items.filter(
            (item) => item.product && item.product.status === "active"
        );
        // calculate total price
        const totalPrice = order.items.reduce((total, item) => {
            const price = +item.quantity * +item.price;
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

    // return success
    return res.status(200).json({
        status: "success",
        metadata: {
            order: update,
        },
    });
};

// get orders by user id
const getOrdersByUserId = async (req, res) => {
    // get_id
    const id = req.params.id;
    // check valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get orders by user_id
    const orders = await orderModel.find({ user: id });
    // check error
    if (!orders) throw new NotFoundError();

    return res.status(200).json({
        status: "success",
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

    // return deleted successfully
    return res.status(200).json({
        status: "success",
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
        status: "success",
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

    // check search string condition
    if (searchString) {
        const codeRegex = new RegExp(searchString, "i");
        orderMatch.$or = [
            { code: codeRegex },
            { "user.fullname": codeRegex },
            { address: codeRegex },
        ];
    }

    // check status condition
    if (status) {
        orderMatch.status = status;
    }

    // check date time condition
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

    // join table to get results
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

    // return export data
    return res.status(200).json({
        status: "success",
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
