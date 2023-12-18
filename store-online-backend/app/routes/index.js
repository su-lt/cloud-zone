const express = require("express");
const router = express.Router();

router.use("/v1/api/access", require("./access"));
router.use("/v1/api/user", require("./user"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/category", require("./category"));
router.use("/v1/api/order", require("./order"));

module.exports = router;
