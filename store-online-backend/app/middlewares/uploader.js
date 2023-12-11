const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary.config");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "CloudZone",
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
