const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const { signUp, login } = require("../../controllers/access.controller");

// login
router.post("/login", asyncHandler(login));

// signup
router.post("/signup", asyncHandler(signUp));

module.exports = router;
