const express = require("express");
const router = express.Router();
const User = require("../models/user")
const { validationResult } = require('express-validator/check')
const { validate } = require('../middleware/validate')

router.get("/", (req, res) => {
  User.findAll().then((data) => {
    res.send(data);
  }).catch((error) => {
    res.status(500).send({ message: error.message || "Error occurred while retrieving user data." });
  });
});

router.post("/", validate(), (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    User.create(req.body).then((user) => {
      console.log('Inserted data into User table')
      res.status(201).json(user);
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
    User.update(req.body).then((user) => {
      console.log('Updated User data')
      res.sendStatus(201).json(user);
    }).catch((error) => {
      res.status(400).send({ message: error.message || "Error occured while updating user data" });
    });
  }
});

module.exports = router;
