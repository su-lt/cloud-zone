const mongoose = require("mongoose");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
require("../models/user.model");

const getOrders = async (req, res) => {
    // get params
    let { searchString, page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    const skip = (page - 1) * limit;

    // set query
    const query = orderModel.find().skip(skip).limit(limit).populate({
        path: "user",
        select: "fullname",
    });
    const countQuery = orderModel.find();

    // search name condition
    if (searchString) {
        const regex = new RegExp(searchString, "i");
        query.where({
            $or: [{ code: regex }, { address: regex }],
        });
        countQuery.where({
            $or: [{ code: regex }, { address: regex }],
        });
    }

    // get total number of products
    const totalOrders = await countQuery.countDocuments().exec();
    // get products
    const orders = await query.lean().exec();
    if (!orders) throw new NotFoundError("Cannot load orders");

    return res.status(200).json({
        message: "success",
        metadata: {
            orders,
            totalOrders,
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
    const { user, address, items, totalPrice } = req.body;
    if (!user && !address && !items && !totalPrice) throw new BadRequestError();

    // check items is array
    if (Array.isArray(items)) {
        for (const item of items) {
            await productModel.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity },
            });
        }
    }

    // create order
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
    order.delete;
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

// generate ordercode
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
    totalOrders,
};
