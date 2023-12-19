const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    getRoles,
    totalCustomer,
} = require("../../controllers/user.controller");
const {
    authentication,
    isAdmin,
} = require("../../middlewares/auth.middleware");

// check authentication
router.use(asyncHandler(authentication));
router.use(asyncHandler(isAdmin));

// get users
router.get("/", asyncHandler(getUsers));

// get total customers
router.get("/totalCustomer", asyncHandler(totalCustomer));

// get roles
router.get("/roles", asyncHandler(getRoles));

// get user by id
router.get("/:id", asyncHandler(getUserById));

// create user
router.post("/", asyncHandler(createUser));

// update user
router.post("/:id", asyncHandler(updateUserById));

// delete user
router.delete("/:id", asyncHandler(deleteUserById));

module.exports = router;
