const jwt = require("jsonwebtoken");
const { decode_token } = require("../utility/token");
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
  const insert_usertype = req.body.user_type;
  if (insert_usertype === 'P') {
    next();
  } else {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
      decode_token(token, ({ user_type }) => {
        if (insert_usertype === 'U') {
          if (!['A', 'S'].includes(user_type)) throw ({ message: "Not authenticated to insert Clinic User" });
        } else if (insert_usertype === 'A') {
          if (!user_type === 'S') throw ({ message: "Not authenticated to insert Clinic User" });
        } else if (insert_usertype === 'S') {
          throw ({ message: "Cannot insert System Admin" });
        } else {
          throw ({ message: "Invalid User" });
        }
        next();
      });

    } catch (ex) {
      console.log(`Catch error:${JSON.stringify(ex)}`);
      res.status(403).send(ex);
    }
  }
};
module.exports = { clinic, system, insert_usertype_check };