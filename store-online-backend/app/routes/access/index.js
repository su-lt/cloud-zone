const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    signUp,
    login,
    refresh,
} = require("../../controllers/access.controller");

// login
router.post("/login", asyncHandler(login));

// signup
router.post("/signup", asyncHandler(signUp));

// refresh
router.post("/refresh", asyncHandler(refresh));

module.exports = router;
