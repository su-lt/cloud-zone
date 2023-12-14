const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./access"));
router.use("/v1/api/user", require("./user"));
router.use("/v1/api/products", require("./product"));
router.use("/v1/api/category", require("./category"));
router.use("/v1/api/order", require("./order"));

module.exports = router;
