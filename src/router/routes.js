const express = require("express");
const router = express.Router();
const user = require("./user");
const misc = require("./misc");

router.use("/user", user);
router.use("/", misc);

module.exports = router;