const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {    
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.email_id = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};