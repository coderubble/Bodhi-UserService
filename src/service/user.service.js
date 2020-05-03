const ClinicUser = require("../models/clinic_user.model");
const User = require("../models/user.model");
const { decode_token, generateAuthToken } = require("../utility/token");
const bcrypt = require("bcryptjs");

exports.userLogin = function ({ email_id, password }, callback) {
  User.findOne({
    where: { email_id }
  }).then((user) => {
    bcrypt.compare(password, user.password, async function (error, result) {
      //If passwords match,check user_type
      if (result) {
        //If user_type is Clinic Admin or Clinic User,get clinic_id from ClinicUser table and set it to user object
        let user_clone = {email_id: user.email_id, user_type: user.user_type, clinic_id: null }
        if (user.user_type === 'A' || user.user_type === 'U') {
          await ClinicUser.findOne({ where: { user_id: email_id } }).then((clinic_user) => {
            user_clone.clinic_id = clinic_user.clinic_id;
            console.log(`Clinic ID exists;Now User object:${JSON.stringify(user_clone)}`);
          })
        }
        callback(null, generateAuthToken(user_clone));
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

exports.userInsert = function ({ email_id, user_type, first_name, last_name, dob, address, contact_no, password, clinic_id }, callback) {
  let userData = { email_id, user_type, first_name, last_name, dob, address, contact_no, clinic_id };
  var user;
  bcrypt.hash(password, Number(process.env.SALT), function (err, hash) {
    if (hash) {
      userData.password = hash;
      User.create(userData).then((user) => {
        console.log(`>>>Clinic id:${clinic_id}`);

        if (clinic_id) {
          ClinicUser.create({
            clinic_id,
            user_id: email_id
          })
        }
      }).then(() => {
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