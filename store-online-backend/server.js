const app = require("./app/app");

const { app_port, server_port } = require("./app/configs");
const { log } = require("./app/helpers");

app.listen(server_port, () => {
    log.white(`Server start on port: ${server_port}`);
});
log.green(`Application start on port: ${app_port}`);

module.exports = app;
