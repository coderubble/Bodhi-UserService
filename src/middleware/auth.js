const jwt = require("jsonwebtoken");
const { decode_token } = require("../utility/token");

module.exports = function (req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    decode_token(token, ({ email_id, user_type }) => {
      req.user = {
        email_id,
        user_type
      }
    });
    next();
  } catch (ex) {
    console.error(`Error in auth middleware: ${ex}`);
    res.status(400).send("Invalid token.");
  }
};
