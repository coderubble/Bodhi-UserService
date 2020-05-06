const jwt = require("jsonwebtoken");
const { decode_token } = require("../utility/token");
const { CLINIC_ADMIN, CLINIC_USER, SYSTEM_ADMIN, PATIENT } = require("../constants/constants");
const clinic = (req, res, next) => {
  if (req.user.user_type === CLINIC_ADMIN || req.user.user_type === SYSTEM_ADMIN) {
    next();
  } else {
    res.sendStatus(401)
  }
}
const system = (req, res, next) => {
  if (req.user.user_type === SYSTEM_ADMIN) {
    next();
  } else {
    res.sendStatus(401)
  }
}

const insertUser = (req, res, next) => {
  const insert_usertype = req.body.user_type;
  if (insert_usertype === PATIENT) {
    next();
  } else {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
      decode_token(token, ({ user_type }) => {
        if (insert_usertype === CLINIC_USER) {
          if (![CLINIC_ADMIN, SYSTEM_ADMIN].includes(user_type)) throw (`Role ${user_type} not authorized to create CLINIC USER`);
        } else if (insert_usertype === CLINIC_ADMIN) {
          if (user_type !== SYSTEM_ADMIN) throw (`Role ${user_type} not authorized to create CLINIC ADMIN`);
        } else if (insert_usertype === SYSTEM_ADMIN) {
          throw ({ message: "Cannot insert System Admin" });
        } else {
          throw ({ message: "Invalid User" });
        }
        next();
      });

    } catch (ex) {
      console.log(`Catch error:${JSON.stringify(ex)}`);
      res.status(403).send({ message: "Not Authorised to perform this action" });
    }
  }
};

const updateUser = (req, res, next) => {
  const loginUserEmailid = req.user.email_id;
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  try {
    decode_token(token, ({ user_type }) => {
      console.log(`login user:${JSON.stringify(user_type)}`);
      if (user_type !== SYSTEM_ADMIN) {
        if (loginUserEmailid != req.body.email_id) {
          throw (`Role ${user_type} not authorised to update this User`);
        }
      }
      next();
    });
  }
  catch (ex) {
    console.log(`Catch error:${JSON.stringify(ex)}`);
    res.status(403).send({ message: "Not Authorised to perform this action" });
  }
};
module.exports = { clinic, system, insertUser, updateUser };