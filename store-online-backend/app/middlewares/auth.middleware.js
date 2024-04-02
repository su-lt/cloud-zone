const keyModel = require("../models/key.model");
const userModel = require("../models/user.model");
const { verifyJWT } = require("../auth/ulti.auth");
const {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} = require("../helpers/errorHandler");

const authentication = async (req, res, next) => {
    // get userId
    // return null string if header null
    const userId = req.headers["x-client-id"];
    if (!userId) throw new BadRequestError();

    // get user
    const user = await userModel.findById(userId).populate("role").lean();
    if (!user) throw new NotFoundError("User not found");

    // get accessToken in cookie
    const accessToken = req.headers["x-token"]; // return null string if header null
    if (!accessToken) throw new BadRequestError();

    // check keys of user
    const keyStore = await keyModel.findOne({ user: userId });
    if (!keyStore) throw new NotFoundError();

    try {
        // verify token
        const decodeUser = verifyJWT(accessToken, keyStore.publicKey);
        if (decodeUser.userId !== userId)
            throw new AuthFailureError("Invalid UserID");

        // set keyStore
        req.keyStore = keyStore;
        req.user = user;

        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError")
            return res.status(200).json({
                code: 401,
                message: error.name,
            });

        return res.status(200).json({
            code: 500,
            error,
            message: "Request failed !",
        });
    }
};

const isAdmin = async (req, res, next) => {
    // get user req.user (check authentication middleware success)
    const user = req.user;

    // check role
    const isAdmin = user.role.name === "ADMIN" ? true : false;
    if (!isAdmin)
        return res.status(401).json({
            message: "Unauthorized access !",
        });

    next();
};

module.exports = { authentication, isAdmin };
