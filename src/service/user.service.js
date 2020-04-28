const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.userLogin = function ({ email_id, password }, callback) {
  User.findOne({
    where: { email_id }
  }).then((user) => {
    bcrypt.compare(password, user.password, function (error, result) {
      if (result) {
        callback(null, User.generateAuthToken(user));
      } else {
        callback("Incorrect Username or Password");
      }
    });
  }).catch((error) => {
    console.log(`Error: ${error}`);
    callback("User not found");
  });
};

exports.userGetAll = function ({ from, to }, callback) {
  const to_record = to || 1;
  const offset = from || 0;
  const limit = Math.min(25, to_record - offset);
  User.findAndCountAll({
    limit,
    offset,
    order: [["email_id", "ASC"]]
  }, { plain: true }).then((users) => {
    callback(null, maskedUser(users.rows));
  }).catch((error) => {
    callback(error);
  });
};

exports.userGetByEmail = function ({ email_id }, callback) {
  User.findOne({
    where: { email_id }
  }).then((user) => {
    callback(null, maskedUser(user));
  }).catch((error) => {
    callback(error);
  });
};

function maskedUser(users) {
  if (!Array.isArray(users)) {
    users = [users];
  }
  return users.map(user => Object.assign({}, { ...user.toJSON(), password: "******" }));
}

exports.userInsert = function ({ email_id, user_type, first_name, last_name, dob, address, contact_no, password }, callback) {
  let userData = { email_id, user_type, first_name, last_name, dob, address, contact_no };
  bcrypt.hash(password, Number(process.env.SALT), function (err, hash) {
    if (hash) {
      userData.password = hash;
      User.create(userData).then((user) => {
        callback(null, { message: `Created Record: ${user.email_id}` });
      }).catch((error) => {
        callback(error);
      });
    }
    else {
      callback("Insert Failed");
    }
  });
};

exports.userUpdate = function ({ email_id, first_name, last_name, dob, address, contact_no }, callback) {
  User.update({
    first_name,
    last_name,
    dob,
    address,
    contact_no
  }, {
    where: { email_id }
  }).then((result) => {
    callback(null, { message: `Updated Record: ${result}` });
  }).catch((error) => {
    callback(error);
  });
};

exports.userDelete = function ({ email_id }, callback) {
  User.destroy({ where: { email_id } }).then((result) => {
    callback(null, { message: `Deleted Record: ${result}` });
  }).catch((error) => {
    callback(error);
  });
};