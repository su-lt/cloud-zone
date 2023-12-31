const mongoose = require("mongoose");
const keyModel = require("../models/key.model");
const roleModel = require("../models/role.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const transporter = require("../helpers/emailHelper");
const {
    generateKeyPairSync,
    createTokenPair,
    verifyJWT,
    createToken,
} = require("../auth/ulti.auth");
const {
    BadRequestError,
    NotFoundError,
    CreateDatabaseError,
    AuthFailureError,
    ForbiddenError,
    ServerError,
} = require("../helpers/errorHandler");

const signUp = async (req, res) => {
    // get data from request body
    let { fullname, email, phone, password, address } = req.body;
    if (!fullname || !email || !phone || !password || !address)
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
        phone,
        address,
        password: passwordHash,
        roles: roleMember._id,
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

        // set refreshToken in cookie headers
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 86400 * 1000, // 3d - milisecond
            httpOnly: true,
        });

        return res.status(201).json({
            message: "Registed successfully !",
            metadata: {
                id: newUser._id,
                accessToken: tokens.accessToken,
                username: newUser.fullname,
                isAdmin: false,
            },
        });
    }

    throw new CreateDatabaseError("Error: Cannot created new shop");
};

const login = async (req, res) => {
    // check params
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError();

    // check exist
    const foundUser = await userModel
        .findOne({ email })
        .where({ status: "active" })
        .populate("role")
        .lean();
    if (!foundUser) throw new BadRequestError("User not registered !");

    // match password
    const match = await bcrypt.compare(password, foundUser.password);
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

    // check refresh token in refresh token used
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
        // if exist
        // clear cookies
        res.clearCookie("refreshToken");
        // remove key store
        await keyModel.findByIdAndDelete(keyStore._id);
        throw new ForbiddenError(
            "Something wrong happened !!! Please re-login"
        );
    }

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
            newAccessToken: tokens.accessToken,
        },
    });
};

const checkAuth = async (req, res) => {
    // get user req.user (check authentication middleware success)
    const user = req.user;

    // check role
    const isAdmin = user.role.name === "ADMIN" ? true : false;
    return res.status(200).json({
        message: "check-authentication",
        metadata: {
            id: user._id,
            isAdmin,
            username: user.fullname,
        },
    });
};

// forgot password
const forgot = async (req, res) => {
    // get email
    const { email } = req.body;
    if (!email) throw new BadRequestError();

    // check exist
    const foundUser = await userModel
        .findOne({ email })
        .where({ status: "active" })
        .lean();
    if (!foundUser) throw new BadRequestError("User not registered !");

    // create access token and refresh token and save
    // create keys pair - asymmetric
    const { privateKey, publicKey } = generateKeyPairSync();

    // create reset-token
    const { _id: userId } = foundUser;
    const token = createToken({ userId }, privateKey);
    const expiredAt = Date.now() + 15 * 60 * 1000; // 15m

    // update store key
    const filter = { user: userId };
    const update = { resetKey: publicKey.toString() };
    const keyStore = await keyModel.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
    });
    if (!keyStore) throw CreateDatabaseError("Cant not create keyStore");

    // get nodemailder config
    const nodemailer = await transporter();

    // email message
    const mailOptions = {
        from: "CloudZone. <cloudzone.noreply@gmail.com>",
        to: email,
        subject: "Forgot Password",
        html: `Hi <b>${foundUser.fullname}</b>,<br>
               You've recently asked to reset password for this CloudZone account: ${email}<br>
               Please click <a href='http://localhost:3000/reset-password/${token}/${userId}/${expiredAt}'>this link</a> to reset the password. This link will expire in 15 minutes.<br>
               If you did not initiate this password reset request, you can safely ignore this email.`,
    };

    // send email
    nodemailer.sendMail(mailOptions, (error, info) => {
        if (error) throw new ServerError("Send email failed");

        return res.status(200).json({
            message: "send reset email successfully",
        });
    });
};

// reset password
const reset = async (req, res) => {
    // get _id
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get params
    let { password, token } = req.body;
    if (!password || !token) throw new BadRequestError();

    // get keyStore
    const keyStore = await keyModel.findOne({ user: id });
    if (!keyStore) throw new NotFoundError();

    // get resetKey
    const { resetKey } = keyStore;
    if (!resetKey) throw new BadRequestError();

    // verify token
    const decode = verifyJWT(token, resetKey);
    if (decode.userId !== id) throw new AuthFailureError("Invalid UserID");

    // encryption password
    const passwordHash = await bcrypt.hash(password, 10);

    // update password
    const foundUser = await userModel.findByIdAndUpdate(
        id,
        { password: passwordHash },
        { new: true }
    );
    if (!foundUser) throw new CreateDatabaseError();

    // remove restKey
    keyStore.resetKey = null;
    await keyStore.save();

    return res.status(200).json({
        message: "reset password successfully",
    });
};

module.exports = {
    signUp,
    login,
    logout,
    refresh,
    checkAuth,
    forgot,
    reset,
};
