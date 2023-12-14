// get environments
require("dotenv").config();

// insert package
const cors = require("cors");
const path = require("path");
const fs = require("fs");
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

// static routes for images
app.use("/images", express.static(path.join(__dirname, "/uploads/images/")));
// handling errors
app.use((error, req, res, next) => {
    // cleanup - remove image upload on cloudinary server
    const images = req.files;
    if (images && images.length > 0) {
        images.map((image) => {
            fs.access(
                path.join(__dirname, "/uploads/images/" + image.filename),
                fs.constants.F_OK,
                (err) => {
                    if (err) {
                        return;
                    }
                    fs.unlink(
                        path.join(
                            __dirname,
                            "/uploads/images/" + image.filename
                        ),
                        (unlinkErr) => {
                            if (unlinkErr) {
                                return;
                            }
                        }
                    );
                }
            );
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
