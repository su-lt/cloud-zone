const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDDINARY_CLOUDNAME,
    api_key: process.env.CLOUDDINARY_KEY,
    api_secret: process.env.CLOUDDINARY_SECRET,
});

module.exports = cloudinary;
