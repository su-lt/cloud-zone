const keyModel = require("../models/key.model");
const { verifyJWT } = require("../auth/ulti.auth");
const {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} = require("../helpers/errorHandler");

const authentication = async (req, res, next) => {
    // get userId
    const userId = req.headers["x-client-id"]; // return null string if header null
    if (!userId) throw new BadRequestError();

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

        // return next
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

const isAdmin = (req, res, next) => {
    const roles = req.user.roles;

    const roleAdmin = roles.find((u) => u.roleName === "admin");
    if (!roleAdmin)
        return res.status(401).json({
            message: "Unauthorized access !",
        });

    next();
};

module.exports = { authentication, isAdmin };
