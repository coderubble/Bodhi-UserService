const express = require("express");
const router = express.Router();
const User = require("../models/user")
const { validationResult } = require('express-validator/check')
const { validate } = require('../middleware/validate')

router.get("/", (req, res) => {
  User.findAndCountAll({
    limit: req.query.to - req.query.from,
    offset: req.query.from,
    order: [["createdAt", "ASC"]]
  }).then((data) => {
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
      res.status(201).json(user);
    }).catch((error) => {
      res.status(400).send({ message: error.message || "Error occured while updating user data" });
    });
  }
});

// This doesn't throw an error if username is invalid.
// If required,can add findById instead of where clause in destroy method.
router.delete("/:user_name", (req, res) => {
  const user_name = req.params.user_name;
  User.destroy({ where: { user_name } }).then(() => {
    console.log('Deleted User data')
    res.sendStatus(200);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occured while deleting user data" });
  });
})

module.exports = router;
