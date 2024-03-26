const express = require("express");
const router = express.Router();
const {
    signUp,
    login,
    logout,
    refresh,
    checkRole,
    forgot,
    reset,
} = require("../../controllers/access.controller");

// services
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../middlewares/auth.middleware");

// login
router.post("/login", asyncHandler(login));
// signup
router.post("/signup", asyncHandler(signUp));
// refresh
router.get("/refresh", asyncHandler(refresh));
// forgot password
router.post("/forgot", asyncHandler(forgot));
// reset password
router.post("/reset/:id", asyncHandler(reset));

// check auth
router.use(asyncHandler(authentication));

// check role
router.get("/checkRole", asyncHandler(checkRole));
// logout
router.get("/logout", asyncHandler(logout));

module.exports = router;
