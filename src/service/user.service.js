const UserFactory = require("../repository/user_repository");
const bcrypt = require("bcryptjs");

exports.userLogin = function ({ email_id, password }, callback) {
  UserFactory.getUser().findOne({
    where: { email_id }
  }).then((user) => {
    bcrypt.compare(password, user.password, function (error, result) {
      if (result) {
        callback(null, UserFactory.getUser().generateAuthToken(user));
      } else {
        callback("Incorrect Username or Password");
      }
    });
  }).catch((error) => {
    callback(error);
  });
};

exports.userGetAll = function ({ from, to }, callback) {
  const to_record = to || 1;
  const offset = from || 0;
  const limit = Math.min(25, to_record - offset);
  UserFactory.getUser().findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "ASC"]]
  }).then((user) => {
    callback(null, user);
  }).catch((error) => {
    callback(error);
  })
};

exports.userGetByEmail = function ({ email_id }, callback) {
  UserFactory.getUser().findOne({
    where: { email_id }
  }).then((user) => {
    callback(null, user);
  }).catch((error) => {
    callback(error);
  });
}