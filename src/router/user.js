const express = require("express");
const router = express.Router();
const User=require("../models/user")

router.get("/", (req, res) => {
  res.status(200).send({
    "donald_trump": {
      "user_type": "patient",
      "email_id": "trump@usa.com",
      "contact_no": "+9198172398712",
      "user_name": "dontrm",
      "first_name": "Donald",
      "last_name": "Trump",
      "dob": "10-10-1950",
      "address": "White house, USA"
    }
  });
});

router.post("/", (req, res) => {
  User.create(req.body).then(() => {
    console.log('Inserted data into User table')
  })
  res.sendStatus(201);
});

module.exports = router;
