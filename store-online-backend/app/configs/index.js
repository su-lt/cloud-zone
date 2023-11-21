const dev = {
    port: process.env.DEV_APP_PORT,
    url: process.env.DEV_BASE_API_URL,
};

const product = {
    port: process.env.PRODUCT_APP_PORT,
    url: process.env.PRODUCT_BASE_API_URL,
};

const config = { dev, product };
const env = process.env.ENV_MODE;

module.exports = config[env];
