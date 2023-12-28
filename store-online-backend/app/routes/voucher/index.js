const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getVouchers,
    getVoucherByCode,
    createVoucher,
    updateVoucherById,
    deleteVoucherById,
} = require("../../controllers/voucher.controller");
const {
    authentication,
    isAdmin,
} = require("../../middlewares/auth.middleware");

// get voucher by id
router.get("/:code", asyncHandler(getVoucherByCode));

// check authentication
router.use(asyncHandler(authentication));
router.use(asyncHandler(isAdmin));

// get vouchers
router.get("/", asyncHandler(getVouchers));
// create voucher
router.post("/", asyncHandler(createVoucher));
// update voucher
router.post("/:id", asyncHandler(updateVoucherById));
// delete voucher
router.delete("/:id", asyncHandler(deleteVoucherById));

module.exports = router;
