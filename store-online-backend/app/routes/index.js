const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./access"));
router.use("/v1/api/products", require("./product"));

module.exports = router;
