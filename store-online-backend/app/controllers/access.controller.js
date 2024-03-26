const mongoose = require("mongoose");
const {
    application: { url, port },
} = require("../configs");
const keyModel = require("../models/key.model");
const roleModel = require("../models/role.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
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
const { validateEmail, validatePhone } = require("../helpers");
const transporter = require("../helpers/emailHelper");

// register new user
const signUp = async (req, res) => {
    // get data from request body
    let { fullname, email, phone, password, address } = req.body;

    // check params null
    if (!fullname || !email || !phone || !password || !address)
        throw new BadRequestError();

    // check email
    if (!validateEmail(email)) throw new BadRequestError("Invalid email");

    // check phone number
    if (!validatePhone(phone)) throw new BadRequestError("Invalid phone");

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
    if (!newUser)
        // create new user failed
        throw new CreateDatabaseError("Error: Cannot created new shop");

    /** create access token and refresh token and save
     * create keys pair - asymmetric
     * */
    const { privateKey, publicKey } = generateKeyPairSync();

    /** create tokens pair - accessToken, refreshToken
     * payload is userId
     * secret key is privateKey
     * */
    const tokens = await createTokenPair({ userId: newUser._id }, privateKey);

    // store key
    const keyStore = await keyModel.create({
        user: newUser._id,
        publicKey,
    });
    if (!keyStore) throw CreateDatabaseError("Cant not create keyStore");

    // set refreshToken in cookie headers
    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 86400 * 3 * 1000, // 3d - milisecond
        httpOnly: true,
    });

    // get nodemailder config
    const nodemailer = await transporter();

    /** email message
     * from admin email
     * to user email
     * subject welcome
     * */
    const mailOptions = {
        from: "CloudZone. <cloudzone.noreply@gmail.com>",
        to: email,
        subject: "Welcome to CloudZone.",
        html: `Hello <b>${fullname}</b>,<br>
               Congratulations on successfully registering and becoming a valued member of our platform.<br>
               We are delighted and appreciate your participation, marking the beginning of a fantastic<br>
               online shopping journey with <a href='${url}:${port}'>CloudZone.</><br><br>
               As a member, you will have the opportunity to experience exclusive benefits, receive<br>
               notifications about exciting promotions, and stay updated on the latest product<br>
               releases. We are committed to providing you with a safe, convenient, and enjoyable<br>
               online shopping experience.<br><br>
               Best regards,<br>
               The CloudZone Team.`,
    };

    // send welcome email
    nodemailer.sendMail(mailOptions);

    // return user
    return res.status(200).json({
        status: "success",
        message: "Registed successfully !",
        metadata: {
            id: newUser._id,
            accessToken: tokens.accessToken,
            username: newUser.fullname,
            isAdmin: false,
        },
    });
};

const login = async (req, res) => {
    /** get params
     * check null params
     *  */
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError();

    // check email
    if (!validateEmail(email)) throw new BadRequestError("Invalid email");

    /** check exist email
     * get mail with active status
     * populate role
     * lean result
     * */
    const foundUser = await userModel
        .findOne({ email })
        .where({ status: "active" })
        .populate("role")
        .lean();
    if (!foundUser) throw new BadRequestError("User not registered !");

    /** compare password
     * check match password
     * */
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication failed");

    /** create access token and refresh token and save
     * create keys pair - asymmetric
     * */
    const { privateKey, publicKey } = generateKeyPairSync();

    // create tokens pair - accessToken, refreshToken
    const { _id: userId } = foundUser;
    const tokens = await createTokenPair({ userId }, privateKey);

    /** update store key
     * filter with userId
     * update publicKey
     * if key null create new key
     * */
    const filter = { user: userId };
    const update = { publicKey: publicKey.toString() };
    const keyStore = await keyModel.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
    });
    if (!keyStore) throw CreateDatabaseError("Cant not create keyStore");

    // set refreshToken in cookie headers
    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 86400 * 3 * 1000, // 3d - milisecond
        httpOnly: true,
    });

    // login successful
    return res.status(200).json({
        status: "success",
        message: "login successfull",
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

    // return message successfull
    return res.status(200).json({
        status: "success",
        message: "logout successfull",
    });
};

const refresh = async (req, res) => {
    // get refresh token in cookies - check null
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new BadRequestError("refreshToken is required");

    // get user id in request headers - check null
    const userId = req.headers["x-client-id"];
    if (!userId) throw new BadRequestError();

    /** get key of user
     * to get publicKey
     * check null
     */
    const keyStore = await keyModel.findOne({ user: userId });
    if (!keyStore) throw new NotFoundError();

    // check refresh token in refresh token used
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
        // console.log("bi xoaaaaa");
        // console.log(">> refreshTokensUsed:", refreshToken);
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
            //add old refreshToken to used list
            refreshTokensUsed: refreshToken,
        },
    });

    // set refreshToken in cookie headers
    await res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 86400 * 3 * 1000, // 3d - milisecond
        httpOnly: true,
    });

    // return new access token
    return res.status(201).json({
        status: "success",
        message: "refresh token successful",
        metadata: {
            newAccessToken: tokens.accessToken,
            rf: tokens.refreshToken,
        },
    });
};

const checkRole = async (req, res) => {
    // get user req.user (check authentication middleware success)
    const user = req.user;

    // check role
    const isAdmin = user.role.name === "ADMIN" ? true : false;

    // return user information
    return res.status(200).json({
        status: "success",
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
    // get email - check null
    const { email } = req.body;
    if (!email) throw new BadRequestError();

    /** check email exist
     * with active user
     * lean result
     */
    const foundUser = await userModel
        .findOne({ email })
        .where({ status: "active" })
        .lean();
    if (!foundUser) throw new BadRequestError("User not registered !");

    // create access token and refresh token and save
    // create keys pair - asymmetric
    const { privateKey, publicKey } = generateKeyPairSync();

    // get userId in foundUser
    const { _id: userId } = foundUser;

    // create reset-token
    const token = createToken({ userId }, privateKey);

    // set expire time is 15m
    const expiredAt = Date.now() + 15 * 60 * 1000; // 15m

    /** update store key
     * resetKey is publicKey
     * if key not exist -> create key
     */
    const filter = { user: userId };
    const update = { resetKey: publicKey.toString() };
    const keyStore = await keyModel.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
    });
    if (!keyStore) throw CreateDatabaseError("Cant not create keyStore");

    // get nodemailder config
    const nodemailer = await transporter();

    /** email message
     * from admin email
     * to user email
     * subject forgot password
     * */
    const mailOptions = {
        from: "CloudZone. <cloudzone.noreply@gmail.com>",
        to: email,
        subject: "Forgot Password",
        html: `Hi <b>${foundUser.fullname}</b>,<br>
               You've recently asked to reset password for this CloudZone account: ${email}<br>
               Please click <a href='${url}:${port}/reset-password/${token}/${userId}/${expiredAt}'>this link</a> to reset the password. This link will expire in 15 minutes.<br>
               If you did not initiate this password reset request, you can safely ignore this email.`,
    };

    // send email
    nodemailer.sendMail(mailOptions, (error, info) => {
        if (error) throw new ServerError("Send email failed");

        // return send email success
        return res.status(200).json({
            status: "success",
            message: "send reset email successfully",
        });
    });
};

// reset password
const reset = async (req, res) => {
    // get _id - check valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Id not valid !");
    }

    // get params - check null
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

    // return reset password successfully
    return res.status(200).json({
        status: "success",
        message: "reset password successfully",
    });
};

module.exports = {
    signUp,
    login,
    logout,
    refresh,
    checkRole,
    forgot,
    reset,
};
