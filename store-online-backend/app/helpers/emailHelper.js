const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const {
    gmailClientId,
    gmailClientSecret,
    gmailRefreshToken,
} = require("../configs");

const nodeMailerConfig = async () => {
    // initialize Oauth2Client
    const myOAuth2Client = new OAuth2Client(gmailClientId, gmailClientSecret);
    // add refresh token
    myOAuth2Client.setCredentials({
        refresh_token: gmailRefreshToken,
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
            clientId: gmailClientId,
            clientSecret: gmailClientSecret,
            refresh_token: gmailRefreshToken,
            accessToken: myAccessToken,
        },
    });

    return transporter;
};

module.exports = nodeMailerConfig;
