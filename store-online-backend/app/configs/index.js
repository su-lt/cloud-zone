// dev mode
const dev = {
    app_url: process.env.DEV_APP_URL,
    app_port: process.env.DEV_APP_PORT,
    server_url: process.env.DEV_SERVER_URL,
    server_port: process.env.DEV_SERVER_PORT,
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME,
    },
    gmailClientId: process.env.DEV_GOOGLE_MAILER_CLIENT_ID,
    gmailClientSecret: process.env.DEV_GOOGLE_MAILER_CLIENT_SECRET,
    gmailRefreshToken: process.env.DEV_GOOGLE_MAILER_REFRESH_TOKEN,
};

// production mode
const product = {
    app_url: process.env.DEV_APP_URL,
    app_port: process.env.DEV_APP_PORT,
    server_url: process.env.DEV_SERVER_URL,
    server_port: process.env.DEV_SERVER_PORT,
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME,
    },
    gmailClientId: process.env.DEV_GOOGLE_MAILER_CLIENT_ID,
    gmailClientSecret: process.env.DEV_GOOGLE_MAILER_CLIENT_SECRET,
    gmailRefreshToken: process.env.DEV_GOOGLE_MAILER_REFRESH_TOKEN,
};

const config = { dev, product };
const env = process.env.ENV_MODE;

module.exports = config[env];
