const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (!process.env.DEV) {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      req.email_id = decoded;
<<<<<<< HEAD
      // TODO: Check in db here?
=======
>>>>>>> 233a9c6361d208aaf0939590b63d7a18de0e2734
      next();
    } catch (ex) {
      res.status(400).send("Invalid token.");
    }
  }
};