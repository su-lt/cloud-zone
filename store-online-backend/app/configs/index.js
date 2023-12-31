// dev mode
const dev = {
    port: process.env.DEV_APP_PORT,
    url: process.env.DEV_BASE_API_URL,
    gmailClientId: process.env.DEV_GOOGLE_MAILER_CLIENT_ID,
    gmailClientSecret: process.env.DEV_GOOGLE_MAILER_CLIENT_SECRET,
    gmailRefreshToken: process.env.DEV_GOOGLE_MAILER_REFRESH_TOKEN,
};

// production mode
const product = {
    port: process.env.PRODUCT_APP_PORT,
    url: process.env.PRODUCT_BASE_API_URL,
    gmailClientId: process.env.PRODUCT_GOOGLE_MAILER_CLIENT_ID,
    gmailClientSecret: process.env.PRODUCT_GOOGLE_MAILER_CLIENT_SECRET,
    gmailRefreshToken: process.env.PRODUCT_GOOGLE_MAILER_REFRESH_TOKEN,
};

const config = { dev, product };
const env = process.env.ENV_MODE;

module.exports = config[env];
