const express = require("express");
const router = express.Router();
const User = require("../models/user")
const { validationResult } = require('express-validator/check')
//const { validationResult } = require('express-validator')
const { validate } = require('../middleware/validate')

router.get("/", (req, res) => {
    res.sendStatus(200);
});

router.post("/", validate('createUser'), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send("errors:"+ JSON.stringify(errors.array()))
    }
    User.create(req.body).then((user) => {
        console.log('Inserted data into User table')
    }).then(() => {
        res.sendStatus(201).json(user);
    }).catch(() => {
        res.sendStatus(400);
    });
});

router.post('/view', (req, res) => {
    User.findAll().then(function (user_data) {
        console.log('View User data')
    })
    res.send(user_data)
})

module.exports = router;
