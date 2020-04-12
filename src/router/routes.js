const express = require("express");
const router = express.Router();
const user = require("./user");

router.use("/user", user);
router.get("/health", (request, response) => {
  response.send({ status: "OK" });
});

module.exports = router;