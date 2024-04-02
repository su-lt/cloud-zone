const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const {
    gmailService: { clientId, clientSecret, refreshToken },
} = require("../configs");

const nodeMailerConfig = async () => {
    // initialize Oauth2Client
    const myOAuth2Client = new OAuth2Client(clientId, clientSecret);
    // add refresh token
    myOAuth2Client.setCredentials({
        refresh_token: refreshToken,
    });

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // get access Token
    const myAccessToken = myAccessTokenObject?.token;

    // config nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "cloudzone.noreply@gmail.com",
            clientId: clientId,
            clientSecret: clientSecret,
            refresh_token: refreshToken,
            accessToken: myAccessToken,
        },
    });

    return transporter;
};

module.exports = nodeMailerConfig;
