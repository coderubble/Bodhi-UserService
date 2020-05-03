const { STRING, ENUM, DATEONLY } = require("sequelize");
const { sequelize } = require("../db/database");
const ClinicUser = require("./clinic_user.model");

let User;
(async function () { 
  console.log(">>>>>>>>>>>>>>>>>Inside model function");
    User = sequelize().define(
    "users",
    {
      email_id: { type: STRING, allowNull: false, unique: true, primaryKey: true },
      password: { type: STRING, allowNull: false },
      first_name: { type: STRING, allowNull: false },
      last_name: { type: STRING, allowNull: false },
      user_type: { type: ENUM("S", "A", "U", "P"), allowNull: false },
      dob: { type: DATEONLY },
      address: { type: STRING, allowNull: false },
      contact_no: { type: STRING, allowNull: false }
    }, {
    classMethods: {
      associate: function (models) {
        User.hasOne(ClinicUser, { foreignKey: 'user_id', sourceKey: 'email_id' });
      }
    }
  });
  console.log(">>>Before sync");
  await User.sync();
})();
console.log("outside user function");

module.exports = User;