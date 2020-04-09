const express = require("express");
const router = express.Router();

const get = router.get("/", (req, res, next) => {
    res.send({
        "donald_trump": {
            "user_type": "patient",
            "email_id": "trump@usa.com",
            "contact_number": "+9198172398712",
            "user_name": "dontrm",
            "first_name": "Donald",
            "last_name": "Trump",
            "dob": "10-10-1950",
            "address": "White house, USA"
        }
    });
});

module.exports = get