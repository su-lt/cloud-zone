const app = require("./app/app");

const { port } = require("./app/configs");

app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});
