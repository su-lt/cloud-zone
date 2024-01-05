// dev mode
const dev = {
    application: {
        url: process.env.DEV_APP_URL,
        port: process.env.DEV_APP_PORT,
    },
    server: {
        url: process.env.DEV_SERVER_URL,
        port: process.env.DEV_SERVER_PORT,
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME,
    },
    gmailService: {
        clientId: process.env.DEV_GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.DEV_GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.DEV_GOOGLE_MAILER_REFRESH_TOKEN,
    },
};

// production mode
const product = {
    application: {
        url: process.env.PRODUCT_APP_URL,
        port: process.env.DEV_APP_PORT,
    },
    server: {
        url: process.env.PRODUCT_SERVER_URL,
        port: process.env.PRODUCT_SERVER_PORT,
    },
    db: {
        host: process.env.PRODUCT_DB_HOST,
        port: process.env.PRODUCT_DB_PORT,
        name: process.env.PRODUCT_DB_NAME,
    },
    gmailService: {
        clientId: process.env.PRODUCT_GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.PRODUCT_GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.PRODUCT_GOOGLE_MAILER_REFRESH_TOKEN,
    },
};

const config = { dev, product };
const env = process.env.ENV_MODE;

module.exports = config[env];
