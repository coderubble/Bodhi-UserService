const express = require("express");
const router = express.Router();
const { userLogin, userGetAll, userGetByEmail, userInsert, userUpdate, userDelete } = require("../service/user.service");
const { validationResult } = require("express-validator");
const { validate } = require("../middleware/validate");
const auth = require("../middleware/auth");
const { clinic, system } = require("../middleware/role_check");
router.post("/login", async (req, res) => {
  console.log(`Inside login controller:${JSON.stringify(req.body)}`);

  userLogin(req.body, (error, result) => {
    if (result) {
      res.setHeader("x-auth-token", result);
      res.send(result);
    }
    else {
      console.log(`Login Error: ${JSON.stringify(error)}`);
      res.status(500).send("Incorrect username or password");
    }
  });
});

router.get("/", [auth, clinic], (req, res) => {
  userGetAll(req.query, (error, result) => {
    if (result) {
      res.send(result);
    }
    else {
      console.log(`Error: ${JSON.stringify(error)}`);
      res.status(400).send({ message: error.errors });
    }
  });
});

router.get("/:email_id", auth, (req, res) => {
  userGetByEmail(req.params, (error, result) => {
    if (result) {
      res.send(result);
    }
    else {
      console.log(`Error: ${JSON.stringify(error)}`);
      res.status(400).send({ message: error.errors });
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
        console.log(`Error: ${JSON.stringify(error)}`);
        res.status(400).send({ message: error.errors });
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
        console.log(`Error: ${JSON.stringify(error)}`);
        res.status(400).send({ message: error.errors });
      }
    });
  }
});

// This doesn"t throw an error if username is invalid.
// If required,can add findById instead of where clause in destroy method.
router.delete("/:email_id", [auth, system], (req, res) => {
  console.log(`Inside Delete controller:${JSON.stringify(req.params)}`);
  userDelete(req.params, (error, result) => {
    if (result) {
      console.log(`Deleted User data${result}`);
      res.sendStatus(200);
    }
    else {
      console.log(`Error: ${JSON.stringify(error)}`);
      res.status(400).send({ message: error.errors });
    }
  });
});

module.exports = router;
