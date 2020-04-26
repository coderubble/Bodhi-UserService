const express = require("express");
const router = express.Router();
const { userLogin, userGetAll, userGetByEmail, userInsert, userUpdate, userDelete } = require("../service/user.service");
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
    userInsert(req.body, (error, result) => {
      if (result) {
        console.log("Inserted data into User table");
        res.status(201).send(result);
      }
      else {
        res.status(400).send({ message: error.message || "Error occured while inserting user data" });
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
    userUpdate(req.body, (error, result) => {
      if (result) {
        console.log("Updated User data");
        res.status(201).json(result);
      }
      else {
        res.status(400).send({ message: error.message || "Error occured while updating user data" });
      }
    });
  }
});

// This doesn"t throw an error if username is invalid.
// If required,can add findById instead of where clause in destroy method.
router.delete("/:email_id", [auth, system], (req, res) => {
  userDelete(req.params, (error, result) => {
    if (result) {
      console.log(`Deleted User data${result}`);
      res.sendStatus(200);
    }
    else {
      res.status(400).send({ message: error.message || "Error occured while deleting user data" });
    }
  });
});

module.exports = router;
