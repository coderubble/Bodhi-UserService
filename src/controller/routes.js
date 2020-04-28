const express = require("express");
const router = express.Router();
const user = require("./user.controller");
const misc = require("./health");
router.use("/user", user);
router.use("/", misc);

module.exports = router;