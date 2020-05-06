const express = require("express");
const router = express.Router();
const startTime = new Date();

router.get("/health", (request, response) => {
  response.send({ 
    status: "OK", 
    start_up_time: startTime,
    VERSION: process.env.VERSION
   });
});

module.exports = router;
