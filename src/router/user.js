const express = require("express");
const router = express.Router();
const { STRING, CHAR } = require("sequelize");
const sequelize = require("../db/database");

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

const User = sequelize.define(
  "users",
  {
    user_name: STRING,
    user_type: CHAR,
    email_id: STRING,
    contact_no: STRING
  }
);

router.post("/create_users", (req, res) => {
  User.sync().then(() => {
    res.send("User table created")
  })
});

// User.sync().then(() => {
//   console.log('User table created')
// });

router.post("/insert_users_data", (req, res) => {
  console.log(req.body);
  User.create(req.body).then(() => {
    console.log('Inserted data into User table')
  })
  res.sendStatus(201);
});



module.exports = router;