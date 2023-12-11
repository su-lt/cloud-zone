// get environments
require("dotenv").config();

// insert package
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cloudinary = require("./configs/cloudinary.config");

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
require("./models/product.model.js");
// init db
require("./databases/db.mongo.js");

// init routers
app.use("/", require("./routes"));

// handling errors
app.use((error, req, res, next) => {
    // cleanup - remove image upload on cloudinary server
    const images = req.files;
    console.log(">>>>>>>>>", images);
    if (images && images.length > 0) {
        images.map((image) => {
            cloudinary.uploader.destroy(image.filename);
        });
    }

    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        // stack: error.stack,
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
