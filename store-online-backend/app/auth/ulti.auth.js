const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");

const generateKeyPairSync = () => {
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
};

// create token pair
const createTokenPair = async (payload, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "5m",
        });
        //refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "3d",
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error.message;
    }
};

// create sign token
const createToken = (payload, privateKey) => {
    try {
        //accessToken
        const token = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "15m",
        });

        return token;
    } catch (error) {
        return error.message;
    }
};

const verifyJWT = (token, keySecret) => {
    return JWT.verify(token, keySecret);
};

module.exports = {
    generateKeyPairSync,
    createToken,
    createTokenPair,
    verifyJWT,
};
