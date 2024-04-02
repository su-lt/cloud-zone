const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const roleModel = require("../models/role.model");
const orderModel = require("../models/order.model");
const bcrypt = require("bcrypt");
const { validateEmail, validatePhone } = require("../helpers");
const {
    NotFoundError,
    BadRequestError,
    CreateDatabaseError,
} = require("../helpers/errorHandler");

const getUsers = async (req, res) => {
    /** get limit
     * if limit undefined, set limit 0
     */
    let { limit } = req.query;
    limit = limit ? +limit : 0;

    // if limit exists, check type
    if (limit && isNaN(limit)) throw new BadRequestError();

    // get params query
    let { searchString, page } = req.query;
    /** check page
     * if page undefined, page = 1
     */
    page = page ? +page : 1;

    // get skip value
    const skip = (page - 1) * limit;

    /** get users - sorted by update time
     * queryUsers is limit products with conditions
     * result exclude password
     * countUsers is number of all products with conditions
     */
    const queryUsers = userModel
        .find()
        .skip(skip)
        .limit(limit)
        .select("-password")
        .populate("role");
    const countUsers = userModel.find();

    // search name condition
    if (searchString) {
        // RegExp - i mode - case-insenitive match
        const regex = new RegExp(searchString, "i");
        queryUsers.where({
            $or: [{ fullname: regex }, { email: regex }, { address: regex }],
        });
        countUsers.where({
            $or: [{ fullname: regex }, { email: regex }, { address: regex }],
        });
    }

    // get total number of users
    const totalUsers = await countUsers.countDocuments().exec();
    // get users
    const users = await queryUsers.lean().exec();
    if (!users) throw new NotFoundError("Cannot load users");

    // return users and total users
    return res.status(200).json({
        status: "success",
        metadata: {
            users,
            totalUsers,
        },
    });
};

const getRoles = async (req, res) => {
    /** get all roles
     * lean results
     * return array of roles
     * */
    const roles = await roleModel.find().lean();
    if (!roles) throw new NotFoundError("Cannot load users");

    // return roles
    return res.status(200).json({
        status: "success",
        metadata: {
            roles,
        },
    });
};

const getUserById = async (req, res) => {
    // get id - check valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    /** get user by id
     * lean result
     */
    const user = await userModel.findById(id).lean();
    if (!user) throw new NotFoundError("user not found");

    // return customize user infomation
    return res.status(200).json({
        status: "success",
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
    let { fullname, email, phone, password, address, status } = req.body;

    // check params null
    if (!fullname || !email || !phone || !password || !address)
        throw new BadRequestError();

    // check email
    if (!validateEmail(email)) throw new BadRequestError("Invalid email");

    // check phone number
    if (!validatePhone(phone)) throw new BadRequestError("Invalid phone");

    /** check exist user
     * params email
     */
    const checkUser = await userModel.findOne({ email }).lean();
    if (checkUser) throw new BadRequestError("User already exists !!!");

    // encryption password
    const passwordHash = await bcrypt.hash(password, 10);

    /** get member role
     * find member role id
     * default role for new user is member
     */
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
        status,
    });
    if (!newUser) CreateDatabaseError();

    // return customize new user infomation
    return res.status(200).json({
        status: "success",
        metadata: {
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phone: newUser.phone,
                address: newUser.address,
            },
        },
    });
};

const updateUserById = async (req, res) => {
    // get id
    const id = req.params.id;
    // check valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get update data in request
    const { role, status } = req.body;
    // check null
    if (!role || !status) throw new BadRequestError();

    // find user by id
    const foundUser = await userModel.findById(id);
    // check error
    if (!foundUser) throw new NotFoundError();
    /** check status
     * if status = deleted -> not valid
     */
    if (foundUser.status === "deleted") throw BadRequestError();

    /** update user
     */
    await foundUser.updateOne({ role, status });

    // return update successfull
    return res.status(200).json({
        status: "success",
    });
};

const updateInfoById = async (req, res) => {
    // get id
    const id = req.params.id;
    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get data in request body
    const { fullname, email, phone, address } = req.body;
    // check data null
    if (!fullname || !email || !phone || !address) throw new BadRequestError();

    // check valid email
    if (!validateEmail(email)) throw new BadRequestError("Invalid email");

    // check valid phone number
    if (!validatePhone(phone)) throw new BadRequestError("Invalid phone");

    /** update user information
     *  get new update result
     * */
    const update = await userModel.findByIdAndUpdate(
        id,
        { fullname, email, phone, address },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    // return update user information
    return res.status(200).json({
        status: "success",
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
    // check valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get data in request
    const { currentpass, newpass } = req.body;
    // check data null
    if (!currentpass || !newpass) throw new BadRequestError();

    // check exist user
    const foundUser = await userModel.findById(id).lean();
    // check user not found
    if (!foundUser) throw new BadRequestError("User not registered !");

    // verify password
    const match = await bcrypt.compare(currentpass, foundUser.password);
    // check password not match
    if (!match) throw new AuthFailureError("Authentication failed");

    // encryption new password
    const passwordHash = await bcrypt.hash(newpass, 10);

    // update new password by id
    const update = await userModel.findByIdAndUpdate(
        id,
        { password: passwordHash },
        { new: true }
    );
    if (!update) throw new CreateDatabaseError();

    // return update password successfull
    return res.status(200).json({
        status: "success",
    });
};

const deleteUserById = async (req, res) => {
    // get id
    const id = req.params.id;
    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    /** soft delete user
     * log delete time
     * change status -> deleted
     */
    const result = await userModel.findByIdAndUpdate(id, {
        deletedAt: new Date(),
        status: "deleted",
    });
    if (!result) throw new CreateDatabaseError();

    // delete orders of user
    await orderModel.deleteMany({
        user: id,
    });

    // return delete user successfull
    return res.status(200).json({
        status: "success",
    });
};

const totalCustomer = async (req, res) => {
    /** count customers with active status and member role
     * populate role and match member
     * count documents
     */
    const count = await userModel
        .find({ status: "active" })
        .populate({
            path: "role",
            match: { name: "MEMBER" },
        })
        .countDocuments();

    // return total
    return res.status(200).json({
        status: "success",
        metadata: {
            count,
        },
    });
};

// get address
const getAddress = async (req, res) => {
    //get id user
    const id = req.params.id;
    // check id valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    /** find user by id
     * lean result
     */
    const user = await userModel.findById(id).lean();

    // return user address
    return res.status(200).json({
        status: "success",
        metadata: {
            address: user.address,
        },
    });
};

// find user by mail/phone address
const findUser = async (req, res) => {
    //get searchString user
    const searchString = req.params.searchString;
    // check id valid
    if (!searchString) throw new BadRequestError();

    if (searchString === "notsearch")
        // return empty user
        return res.status(200).json({
            status: "success",
            metadata: {
                users: [],
            },
        });

    const queryUsers = userModel
        .find()
        .limit(10)
        .select("fullname email phone address")
        .where({ status: { $ne: "deleted" } })
        .populate("role");

    /** find user by searchString
     */
    // RegExp - i mode - case-insenitive match
    const regex = new RegExp(searchString, "i");
    queryUsers.where({
        $or: [{ phone: regex }, { email: regex }],
    });
    // execute
    const users = await queryUsers.exec();

    // return found users
    return res.status(200).json({
        status: "success",
        metadata: {
            users,
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
    findUser,
};
