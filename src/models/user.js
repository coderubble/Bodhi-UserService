const { STRING, ENUM, DATE } = require("sequelize");
const sequelize = require("../db/database");

const User = sequelize.define(
  "users",
  {
    email_id: { type: STRING, allowNull: false, unique: true, primaryKey: true },
    password:{type:STRING,allowNull: false},
    first_name: { type: STRING,allowNull: false },
    last_name: { type: STRING,allowNull: false },
    user_type: { type: ENUM("S", "C", "P", "D"), allowNull: false },
    dob: { type: DATE },
    address: { type: STRING,allowNull: false },
    contact_no: { type: STRING, allowNull: false }
  }
);

User.sync().then(() => {
  console.log("User table created");
});

module.exports = User;