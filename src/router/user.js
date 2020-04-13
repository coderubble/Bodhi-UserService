const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const { validate } = require("../middleware/validate");
const auth = require('../middleware/auth');
const { clinic, system } = require('../middleware/role_check');

router.post("/login", async (req, res) => {
  const email_id = req.body.email_id;
  const password = req.body.password;
  User.findOne({
    where: { email_id }
  }).then((user) => {
    bcrypt.compare(password, user.password, function (error, result) {
      if (result) {
        const token = User.generateAuthToken(user);
        res.setHeader("x-auth-token", token);
        res.send(token);
      } else {
        return res.status(500).send("Incorrect username or password");
      }
    });
  }).catch((error) => {
    res.status(500).send({ message: error.message });
  });
});

router.get("/", [auth, clinic], (req, res) => {
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
    res.status(400).send({ message: error.message || "Error occurred while retrieving user data." });
  });
});

router.get("/:email_id", auth, (req, res) => {
  const email_id = req.params.email_id;
  User.findOne({
    where: { email_id }
  }).then((user) => {
    res.send(user);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occurred while retrieving user data." });
  });
});

router.post("/", validate(), async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    const { email_id, user_type, first_name, last_name, dob, address, contact_no } = req.body
    const userData = { email_id, user_type, first_name, last_name, dob, address, contact_no }
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      userData.password = hash;
    });
    User.create(userData).then((user) => {
      console.log("Inserted data into User table");
      res.status(201).send(clean(user));
    }).catch((error) => {
      res.status(400).send({ message: error.message || "Error occured while inserting user data" });
    });
  }
});

router.put("/", [auth, clinic], validate(), (req, res) => {
  const login_user = req.user.email_id;
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else if (login_user != req.body.email_id) {
    res.status(401).send('Unauthorised to update this User');
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
router.delete("/:email_id", [auth, system], (req, res) => {
  const email_id = req.params.email_id;
  User.destroy({ where: { email_id } }).then(() => {
    console.log("Deleted User data");
    res.sendStatus(200);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occured while deleting user data" });
  });
});

module.exports = router;
