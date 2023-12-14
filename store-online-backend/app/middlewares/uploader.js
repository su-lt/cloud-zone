const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./app/uploads/images/");
    },
    filename: function (req, file, cb) {
        const extend = file.originalname.split(".");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}.${extend[extend.length - 1]}`);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
