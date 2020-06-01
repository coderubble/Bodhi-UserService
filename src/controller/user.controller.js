const express = require("express");
const router = express.Router();
const { userLogin, userGetAll, userGetByEmail, userInsert, userUpdate, userDelete } = require("../service/user.service");
const { validationResult } = require("express-validator");
const { validate } = require("../middleware/validate");
const {validationUpdate}=require("../middleware/validation_for_update");
const auth = require("../middleware/auth");
const { decode_token } = require("../utility/token");
const { clinic, system, insertUser, updateUser } = require("../middleware/role_check");
router.post("/login", (req, res) => {
  userLogin(req.body, (error, result) => {
    if (result) {
      res.setHeader("x-auth-token", result);
      res.status(200).send(result);
    } else {
      res.status(500).send({error});
    }
  });
});

router.get("/", [auth, clinic], (req, res) => {
  userGetAll(req.query, req.user, (error, result) => {
    if (result) {
      res.send(result);
    } else {
      console.error(`Error: ${JSON.stringify(error)}`);
      res.status(400).send({ message: error.errors });
    }
  });
});

router.get("/:email_id", auth, (req, res) => {
  userGetByEmail(req.params, (error, result) => {
    if (result) {
      res.send(result);
    } else {
      console.error(`Error: ${JSON.stringify(error)}`);
      res.status(400).send({error});
    }
  })
});

router.post("/", insertUser, validate(), function (req, res) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    let loggedInUser;
    if (token) {
      loggedInUser = decode_token(token);
    }
    userInsert(req.body, loggedInUser, (error, result) => {
      if (result) {
        res.status(201).send(result);
      }
      else {
        console.error(`Insert Error: ${JSON.stringify(error)}`);
        res.status(400).send({error});
      }
    });
  }
});

router.put("/", auth, updateUser, validationUpdate(), (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(`Validation errors: ${JSON.stringify(validationErrors.array())}`);
  } else {
    userUpdate(req.body, (error, result) => {
      if (result) {
        res.status(201).json(result);
      }
      else {
        console.error(`Error: ${JSON.stringify(error)}`);
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
      res.sendStatus(200);
    } else {
      console.error(`Error: ${JSON.stringify(error)}`);
      res.status(400).send({ message: error.errors });
    }
  });
});

module.exports = router;
