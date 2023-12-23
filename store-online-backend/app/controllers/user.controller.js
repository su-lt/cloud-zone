const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const roleModel = require("../models/role.model");
const bcrypt = require("bcrypt");

const {
    NotFoundError,
    BadRequestError,
    CreateDatabaseError,
} = require("../helpers/errorHandler");
const orderModel = require("../models/order.model");

const getUsers = async (req, res) => {
    // get params
    let { searchString, page } = req.query;
    page = parseInt(page) || 1;

    // set limit product
    const limit = 12;
    const skip = (page - 1) * limit;

    // set query
    const query = userModel
        .find()
        .skip(skip)
        .limit(limit)
        .select("-password")
        .populate("role");
    const countQuery = userModel.find();

    // search name condition
    if (searchString) {
        const regex = new RegExp(searchString, "i");
        query.where({
            $or: [{ fullname: regex }, { email: regex }, { address: regex }],
        });
        countQuery.where({
            $or: [{ fullname: regex }, { email: regex }, { address: regex }],
        });
    }

    // get total number of users
    const totalUsers = await countQuery.countDocuments().exec();
    // get users
    const users = await query.lean().exec();
    if (!users) throw new NotFoundError("Cannot load users");

    return res.status(200).json({
        message: "success",
        metadata: {
            users,
            totalUsers,
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

    const user = await userModel.findById(id);
    if (!user) throw new NotFoundError("user not found");

    return res.status(200).json({
        message: "success",
        metadata: {
            user: {
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
        },
    });
};

const createUser = async (req, res) => {
    // get data from request body
    let { fullname, email, phone, password, address } = req.body;
    if (!fullname || !email || !phone || !password || !address)
        throw new BadRequestError();

    phone = parseInt(phone);

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
        phone,
        address,
        password: passwordHash,
        role: roleMember._id,
    });
    if (!newUser) CreateDatabaseError();

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

const updateInfoById = async (req, res) => {
    // get id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // check data null
    const { fullname, email, phone, address } = req.body;
    if (!fullname || !email || !phone || !address) throw new BadRequestError();

    // update
    const update = await userModel.findByIdAndUpdate(
        id,
        { fullname, email, phone, address },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    return res.status(200).json({
        message: "success",
        metadata: {
            user: {
                fullname: update.fullname,
                email: update.email,
                phone: update.phone,
                address: update.address,
            },
        },
    });
};

const updatePasswordById = async (req, res) => {
    // get id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // check data null
    const { currentpass, newpass } = req.body;
    if (!currentpass || !newpass) throw new BadRequestError();

    // check exist
    const foundUser = await userModel.findById(id).lean();
    if (!foundUser) throw new BadRequestError("User not registered !");

    // verify password
    const match = bcrypt.compare(currentpass, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication failed");

    // encryption password
    const passwordHash = await bcrypt.hash(newpass, 10);

    // update
    const update = await userModel.findByIdAndUpdate(
        id,
        { password: passwordHash },
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
        status: "deleted",
    });
    if (!result) throw new CreateDatabaseError();

    await orderModel.deleteMany({
        user: id,
    });

    return res.status(200).json({
        message: "deleted successfully",
    });
};

const totalCustomer = async (req, res) => {
    // count customers with active status and member role
    const count = await userModel
        .find({ status: "active" })
        .populate({
            path: "role",
            match: { name: "MEMBER" },
        })
        .countDocuments();

    return res.status(200).json({
        message: "success",
        metadata: {
            count,
        },
    });
};

// get address
const getAddress = async (req, res) => {
    //get id user
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // find user
    const user = await userModel.findById(id).lean();

    return res.status(200).json({
        message: "success",
        metadata: {
            address: user.address,
        },
    });
};

module.exports = {
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
};
