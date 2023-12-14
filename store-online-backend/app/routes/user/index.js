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
} = require("../../controllers/user.controller");

// get users
router.get("/", asyncHandler(getUsers));

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