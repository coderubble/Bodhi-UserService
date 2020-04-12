const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const { validate } = require("../middleware/validate");
const auth = require('../middleware/auth');

router.get("/", auth, (req, res) => {
  const to = req.query.to || 1;
  const offset = req.query.from || 0;
  const limit = Math.min(25, to - offset);
  User.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "ASC"]]
  }).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.status(500).send({ message: error.message || "Error occurred while retrieving user data." });
  });
});

router.post("/", validate(), async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    const { email_id, user_type, first_name, last_name, dob, address, contact_no } = req.body
    const userData = { email_id, user_type, first_name, last_name, dob, address, contact_no }
    userData.password = await bcrypt.hash(req.body.password, 10);
    User.create(userData).then((user) => {
      console.log("Inserted data into User table");
      const token = User.generateAuthToken(userData.email_id);
      res.setHeader("x-auth-token", token);
      res.status(201).send(user);
    }).catch((error) => {
      res.status(400).send({ message: error.message || "Error occured while inserting user data" });
    });
  }
});

router.put("/", validate(), (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    const { first_name, last_name, dob, address, contact_no } = req.body;
    User.update({
      first_name,
      last_name,
      dob,
      address,
      contact_no
    },
      { where: { email_id: req.body.email_id } }
    ).then((user) => {
      console.log("Updated User data");
      res.status(201).json(user);
    }).catch((error) => {
      res.status(400).send({ message: error.message || "Error occured while updating user data" });
    });
  }
});

// This doesn"t throw an error if username is invalid.
// If required,can add findById instead of where clause in destroy method.
router.delete("/:email_id", (req, res) => {
  const email_id = req.params.email_id;
  User.destroy({ where: { email_id } }).then(() => {
    console.log("Deleted User data");
    res.sendStatus(200);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occured while deleting user data" });
  });
});

// function getUserDetails(request) {
//   const { email_id,user_type,first_name, last_name, dob, address, contact_no } = request;
//   return { email_id,user_type,first_name, last_name, dob, address, contact_no }
// }

module.exports = router;
