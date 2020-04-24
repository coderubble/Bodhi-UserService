const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserFactory = require("../repository/user_repository");
const { userLogin, userGetAll, userGetByEmail } = require("../service/user.service");
const { validationResult } = require("express-validator/check");
const { validate } = require("../middleware/validate");
const auth = require("../middleware/auth");
const { clinic, system } = require("../middleware/role_check");

router.post("/login", async (req, res) => {
  userLogin(req.body, (error, result) => {
    if (result) {
      res.setHeader("x-auth-token", result);
      res.send(result);
    }
    else {
      res.status(500).send(error || "Incorrect username or password");
    }
  });
});

router.get("/", [auth, clinic], (req, res) => {
  userGetAll(req.query, (error, result) => {
    if (result) {
      res.send(result);
    }
    else {
      res.status(400).send({ message: error.message || "Error occurred while retrieving user data." });
    }
  });
});

router.get("/:email_id", auth, (req, res) => {
  userGetByEmail(req.params, (error, result) => {
    if (result) {
      res.send(result);
    }
    else {
      res.status(400).send({ message: error.message || "Error occurred while retrieving user data by email" });
    }
  })
});

router.post("/", validate(), function (req, res) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    const { email_id, user_type, first_name, last_name, dob, address, contact_no, password } = req.body;
    let userData = { email_id, user_type, first_name, last_name, dob, address, contact_no };
    bcrypt.hash(password, Number(process.env.SALT), function (err, hash) {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        userData.password = hash;
        UserFactory.getUser().create(userData).then((user) => {
          console.log("Inserted data into User table");
          res.status(201).send(user);
        }).catch((error) => {
          res.status(400).send({ message: error.message || "Error occured while inserting user data" });
        });
      }
    });
  }
});

router.put("/", [auth, clinic], validate(), (req, res) => {
  const login_user = req.body.email_id;
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else if (login_user != req.body.email_id) {
    res.status(401).send("Unauthorised to update this User");
  } else {
    const { first_name, last_name, dob, address, contact_no } = req.body;
    UserFactory.getUser().update({
      first_name,
      last_name,
      dob,
      address,
      contact_no
    }, { where: { email_id: req.body.email_id } }
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
  UserFactory.getUser().destroy({ where: { email_id } }).then(() => {
    console.log("Deleted User data");
    res.sendStatus(200);
  }).catch((error) => {
    res.status(400).send({ message: error.message || "Error occured while deleting user data" });
  });
});

module.exports = router;
