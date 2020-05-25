const models = require("../models");
const ClinicUser = models.clinic_user;
const User = models.user;
const { generateAuthToken } = require("../utility/token");
const bcrypt = require("bcryptjs");
const sequelize = models.sequelize;
const { CLINIC_ADMIN, CLINIC_USER, SYSTEM_ADMIN, PATIENT } = require("../constants/constants")

exports.userLogin = function ({ email_id, password }, callback) {
  User.findOne({
    where: { email_id }
  }).then((user) => {
    bcrypt.compare(password, user.password, async function (error, result) {
      //If passwords match,check user_type
      if (result) {
        //If user_type is Clinic Admin or Clinic User,get clinic_id from ClinicUser table and set it to user object
        let user_clone = { email_id: user.email_id, user_type: user.user_type, clinic_id: null }
        if ([ CLINIC_ADMIN, CLINIC_USER ].includes(user.user_type)) {
          await ClinicUser.findOne({ where: { email_id } }).then((clinic_user) => {
            user_clone.clinic_id = clinic_user.clinic_id;
          })
        }
        const authToken = generateAuthToken(user_clone);
        const loginResult = {
          token: authToken,
          email_id: user.email_id,
          first_name: user.first_name,
          last_name: user.last_name,
        }
        return callback(null, loginResult);
      } else {
        return callback({error});
      }
    });
  }).catch((error) => {
    console.log(`Catch Login Error: ${error}`);
    callback(`No such user`);
  });
};

exports.userGetAll = function ({ from, to }, { user_type, clinic_id }, callback) {
  const to_record = to || 1;
  const offset = from || 0;
  const limit = Math.min(25, to_record - offset);
  const select_left = `select u.email_id, first_name, last_name, dob, user_type,address, contact_no,c.clinic_id from users u
   left outer join	clinic_users c on u.email_id = c.email_id`;
  const where = ` where u.user_type='U' and c.clinic_id='${clinic_id}'`;
  const count = ` limit ${limit}  offset ${offset}`;
  let select_query;
  try {
    if (user_type === 'S') {
      select_query = select_left + count;
    } else if (user_type === 'A') {
      select_query = select_left + where + count;
    } else {
      throw new Error('Not authorised');
    }
    sequelize.query(select_query, {
      type: User.SELECT
    }).then((records) => {
      return callback(null, records[ 0 ]);
    }).catch((err) => {
      return callback(err);
    })
  }
  catch (err) {
    callback(err)
  }
};

exports.userGetByEmail = function ({ email_id }, callback) {
  User.findOne({
    where: { email_id }
  }).then((user) => {
    return callback(null, maskedUser(user));
  }).catch((error) => {
    console.error(`Error: ${error}`);
    return callback(error);
  });
};

function maskedUser(users) {
  if (!Array.isArray(users)) {
    users = [ users ];
  }
  return users.map(user => Object.assign({}, { ...user.toJSON(), password: "******" }));
}

exports.userInsert = function (userData, loggedInUser, callback) {
  bcrypt.hash(userData.password, Number(process.env.SALT), async function (err, hash) {
    if (hash) {
      let transaction = null;
      try {
        transaction = await sequelize.transaction();
        const user = await User.create({ ...userData, password: hash }, { transaction });
        console.log(`Created user:${JSON.stringify(user)}`);
        if (userData.user_type !== PATIENT) {
          let { clinic_id, user_type } = loggedInUser;
          if (user_type === SYSTEM_ADMIN) {
            clinic_id = userData.clinic_id
          }
          await ClinicUser.create({ clinic_id, email_id: userData.email_id }, { transaction });
        }
        await transaction.commit();
        if (user) {
          callback(null, {
            status: "Record Created Successfully",
            email_id: user.email_id,
            user_type: user.user_type
          });
        }
      } catch (error) {
        await transaction.rollback();
        // const err = error.errors;
        // console.log(`Err:${JSON.stringify(err)}`);

        // let error_message = null;
        // if (err) {
        //   err.forEach(element => error_message = element.message);
        //   return callback({ message: error_message });
        // }
        callback(error);
      }
    } else {
      callback(err);
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
    console.error(`Error: ${error}`);
    callback(error);
  });
};

exports.userDelete = function ({ email_id }, callback) {
  User.destroy({ where: { email_id } }).then((result) => {
    callback(null, { message: `Deleted Record: ${result}` });
  }).catch((error) => {
    console.error(`Error: ${error}`);
    callback(error);
  });
};
