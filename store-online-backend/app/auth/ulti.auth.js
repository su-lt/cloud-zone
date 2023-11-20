const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");

const generateKeyPairSync = () => {
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
};

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
            expiresIn: "7d",
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error.message;
    }
};

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = {
    generateKeyPairSync,
    createTokenPair,
    verifyJWT,
};
