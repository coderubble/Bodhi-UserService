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

