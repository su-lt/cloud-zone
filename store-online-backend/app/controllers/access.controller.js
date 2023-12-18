const keyModel = require("../models/key.model");
const roleModel = require("../models/role.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
    generateKeyPairSync,
    createTokenPair,
    verifyJWT,
} = require("../auth/ulti.auth");
const {
    BadRequestError,
    NotFoundError,
    CreateDatabaseError,
    AuthFailureError,
} = require("../helpers/errorHandler");

const signUp = async (req, res) => {
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

    if (newUser) {
        // create keys pair - asymmetric
        const { privateKey, publicKey } = generateKeyPairSync();

        // create tokens pair - accessToken, refreshToken
        const tokens = await createTokenPair(
            { userId: newUser._id },
            privateKey
        );

        // store key
        const keyStore = await keyModel.create({
            user: newUser._id,
            publicKey,
        });
        if (!keyStore) throw CreateDatabaseError("Cant not create keyStore");

        // set accessToken, refreshToken in cookie headers
        res.cookie("accessToken", tokens.accessToken, {
            maxAge: 300 * 1000, // 5m - milisecond
            httpOnly: true,
        }).cookie("refreshToken", tokens.refreshToken, {
            maxAge: 86400 * 1000, // 1d - milisecond
            httpOnly: true,
        });

        return res.status(201).json({
            message: "Registed successfully !",
            metadata: {
                id: newUser._id,
            },
        });
    }

    throw new CreateDatabaseError("Error: Cannot created new shop");
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // check exist
    const foundUser = await userModel
        .findOne({ email })
        .populate("role")
        .lean();
    if (!foundUser) throw new BadRequestError("User not registered !");

    // match password
    const match = bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication failed");

    // create access token and refresh token and save
    // create keys pair - asymmetric
    const { privateKey, publicKey } = generateKeyPairSync();

    // create tokens pair - accessToken, refreshToken
    const { _id: userId } = foundUser;
    const tokens = await createTokenPair({ userId }, privateKey);

    // update store key
    const filter = { user: userId };
    const update = { publicKey: publicKey.toString() };
    const keyStore = await keyModel.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
    });
    if (!keyStore) throw CreateDatabaseError("Cant not create keyStore");

    // set refreshToken in cookie headers
    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 86400 * 1000, // 3d - milisecond
        httpOnly: true,
    });

    return res.status(201).json({
        message: "login",
        metadata: {
            id: userId,
            accessToken: tokens.accessToken,
            username: foundUser.fullname,
            isAdmin: foundUser.role.name === "ADMIN" ? true : false,
        },
    });
};

const logout = async (req, res) => {
    // clear cookies
    res.clearCookie("refreshToken");

    return res.status(200).json({
        message: "logout",
    });
};

const refresh = async (req, res) => {
    // get refresh token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new BadRequestError("token is required");

    // get user id
    const userId = req.headers["x-client-id"];
    if (!userId) throw new BadRequestError();

    // check keys of user
    const keyStore = await keyModel.findOne({ user: userId });
    if (!keyStore) throw new NotFoundError();

    // verify token
    const decodeUser = verifyJWT(refreshToken, keyStore.publicKey);
    if (decodeUser.userId !== userId)
        throw new AuthFailureError("Invalid UserID");

    // create access token and refresh token and save
    // create keys pair - asymmetric
    const { privateKey, publicKey } = generateKeyPairSync();

    // create tokens pair - accessToken, refreshToken
    const tokens = await createTokenPair({ userId }, privateKey);

    // update store key
    //  -> update new tokens pair
    await keyStore.updateOne({
        $set: {
            publicKey: publicKey,
        },
        $addToSet: {
            refreshTokensUsed: refreshToken, //add onl refreshToken to usedl ist
        },
    });

    // set refreshToken in cookie headers
    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 86400 * 1000, // 3d - milisecond
        httpOnly: true,
    });

    return res.status(201).json({
        message: "success",
        metadata: {
            accessToken: tokens.accessToken,
        },
    });
};

const checkAuth = async (req, res) => {
    // get userId in req.keystone (check authentication middleware)
    const id = req.keyStore.user;

    // get user
    const user = await userModel.findById(id).populate("role").lean();
    if (!user) throw new NotFoundError("User not found");

    // check role
    const isAdmin = user.role.name === "ADMIN" ? true : false;
    return res.status(200).json({
        message: "check-authentication",
        metadata: {
            isAdmin,
            username: user.fullname,
        },
    });
};

module.exports = {
    signUp,
    login,
    logout,
    refresh,
    checkAuth,
};
