const app = require("./app/app");

const { application, server } = require("./app/configs");
const { log } = require("./app/helpers");

app.listen(server.port, () => {
    log.white(`Server start on port: ${server.port}`);
});
log.green(`Application start on port: ${application.port}`);

module.exports = app;
