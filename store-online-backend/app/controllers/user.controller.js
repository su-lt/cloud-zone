const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const roleModel = require("../models/role.model");
const bcrypt = require("bcrypt");

const {
    NotFoundError,
    BadRequestError,
    CreateDatabaseError,
} = require("../helpers/errorHandler");

const getUsers = async (req, res) => {
    const users = await userModel
        .find()
        .select("-password")
        .populate("role")
        .lean();
    if (!users) throw new NotFoundError("Cannot load users");

    return res.status(200).json({
        message: "success",
        metadata: {
            users,
        },
    });
};

const getRoles = async (req, res) => {
    const roles = await roleModel.find().lean();
    if (!roles) throw new NotFoundError("Cannot load users");

    return res.status(200).json({
        message: "success",
        metadata: {
            roles,
        },
    });
};

const getUserById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const category = await categoryModel.findById(id);
    if (!category) throw new NotFoundError("category not found");

    return res.status(200).json({
        message: "success",
        metadata: {
            category,
        },
    });
};

const createUser = async (req, res) => {
    // get data from request body
    const { fullname, email, password, address } = req.body;
    if (!fullname || !email || !password || !address)
        throw new BadRequestError();

    // check exist user
    const checkUser = await userModel.findOne({ email }).lean();
    if (checkUser) throw new BadRequestError("User already exists !!!");

    // encryption password
    const passwordHash = await bcrypt.hash(password, 10);

    // get member role
    const roleMember = await roleModel.findOne({ name: "MEMBER" }).lean();
    if (!roleMember) throw new NotFoundError();

    // create new user
    const newUser = await userModel.create({
        fullname,
        email,
        address,
        password: passwordHash,
        roles: [roleMember._id],
    });

    return res.status(200).json({
        message: "success",
        metadata: {
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
            },
        },
    });
};

const updateUserById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const { role, status } = req.body;
    if (!role || !status) throw new BadRequestError();

    const update = await userModel.findByIdAndUpdate(
        id,
        { role, status },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
    });
};

const deleteUserById = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    const result = await userModel.findByIdAndUpdate(id, {
        deletedAt: new Date(),
        status: "inactive",
    });
    if (!result) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "deleted successfully",
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    getRoles,
};
