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
    getAddress,
    updateInfoById,
    updatePasswordById,
} = require("../../controllers/user.controller");
const {
    authentication,
    isAdmin,
} = require("../../middlewares/auth.middleware");

// check authentication
router.use(asyncHandler(authentication));
// get user address
router.get("/address/:id", asyncHandler(getAddress));
// get user by id
router.put("/profile/:id", asyncHandler(updateInfoById));
// get user by id
router.patch("/profile/:id", asyncHandler(updatePasswordById));
// get user by id
router.get("/profile/:id", asyncHandler(getUserById));
// check admin role
router.use(asyncHandler(isAdmin));
// get users
router.get("/", asyncHandler(getUsers));
// get total customers
router.get("/totalCustomer", asyncHandler(totalCustomer));
// get roles
router.get("/roles", asyncHandler(getRoles));
// create user
router.post("/", asyncHandler(createUser));
// update user
router.post("/:id", asyncHandler(updateUserById));
// delete user
router.delete("/:id", asyncHandler(deleteUserById));

module.exports = router;
