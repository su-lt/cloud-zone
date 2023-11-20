// get environments
require("dotenv").config();

// insert package
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// init db
require("./databases/db.mongo.js");

// init routers
app.use("/", require("./routes"));

// handling errors
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        // stack: error.stack,
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
