const dev = {
    port: process.env.DEV_APP_PORT,
};

const product = {
    port: process.env.PRODUCT_APP_PORT,
};

const config = { dev, product };
const env = process.env.ENV_MODE;

module.exports = config[env];
