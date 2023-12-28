const mongoose = require("mongoose");
const {
    NotFoundError,
    BadRequestError,
    CreateDatabaseError,
} = require("../helpers/errorHandler");
const voucherModel = require("../models/voucher.model");
const generateCode = require("../helpers/generateCode");

const getVouchers = async (req, res) => {
    // get params
    let { searchString, page } = req.query;
    page = parseInt(page) || 1;

    // set limit product
    const limit = 12;
    const skip = (page - 1) * limit;

    // get all vouchers sorted by update time
    const query = voucherModel.find().skip(skip).limit(limit);
    const countQuery = voucherModel.find();

    // search name condition
    if (searchString) {
        const regex = new RegExp(searchString, "i");
        query.where(
            !isNaN(searchString)
                ? { discount: Number(searchString) }
                : { code: regex }
        );
        countQuery.where(
            !isNaN(searchString)
                ? { discount: Number(searchString) }
                : { code: regex }
        );
    }

    // get total number of products
    const totalVoucher = await countQuery.countDocuments().exec();
    // get products
    const vouchers = await query.lean().exec();
    if (!vouchers) throw new NotFoundError("Cannot load categories");

    return res.status(200).json({
        message: "success",
        metadata: {
            vouchers,
            totalVoucher,
        },
    });
};

const getVoucherByCode = async (req, res) => {
    // get code
    const code = req.params.code;
    if (!code) throw new BadRequestError("code not valid !");

    // get voucher by id
    const voucher = await voucherModel
        .findOne({ code })
        .where({ status: "available" });
    if (!voucher) throw new NotFoundError("voucher not found");

    return res.status(200).json({
        message: "success",
        metadata: {
            voucher,
        },
    });
};

const createVoucher = async (req, res) => {
    const discount = req.body.discount;
    if (!discount) throw new BadRequestError("discount is required");

    // create a new voucher
    const voucher = await voucherModel.create({
        discount,
        code: generateCode(),
    });
    if (!voucher) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            voucher,
        },
    });
};

const updateVoucherById = async (req, res) => {
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const status = req.body.status;
    if (!status) throw new BadRequestError("status is required");

    // update voucher
    const update = await voucherModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            status: update,
        },
    });
};

const deleteVoucherById = async (req, res) => {
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // soft delete voucher
    const result = await voucherModel.findByIdAndDelete(id);
    if (!result) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "deleted successfully",
    });
};

module.exports = {
    getVouchers,
    getVoucherByCode,
    createVoucher,
    updateVoucherById,
    deleteVoucherById,
};
