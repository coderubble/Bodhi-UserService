const jwt = require("jsonwebtoken");
const clinic = (req, res, next) => {
  if (req.user.user_type === 'C' || req.user.user_type === 'S') {
    next();
  } else {
    res.sendStatus(401)
  }
}
const system = (req, res, next) => {
  if (req.user.user_type === 'S') {
    next();
  } else {
    res.sendStatus(401)
  }
}

const insert_usertype_check = (req, res, next) => {
  const user_type = req.body.user_type;
  if (user_type === 'P') {
    next();
  } else {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      if (user_type === 'U') {
        if (!['A', 'S'].includes(decoded.user_type)) throw ({ message: "Not authenticated to insert Clinic User" });
      } else if (user_type === 'A') {
        if (!decoded.user_type === 'S') throw ({ message: "Not authenticated to insert Clinic User" });
      } else if (user_type === 'S') {
        throw ({ message: "Cannot insert System Admin" });
      } else {
        throw ({ message: "Invalid User" });
      }
      next();
    } catch (ex) {
      console.log(`Catch error:${JSON.verify(ex)}`);
      res.status(403).send(ex);
    }
  }
};
module.exports = { clinic, system, insert_usertype_check };