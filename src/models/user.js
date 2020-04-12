const { STRING, ENUM, DATEONLY } = require("sequelize");
const sequelize = require("../db/database");
const jwt = require('jsonwebtoken');

const User = sequelize.define(
  "users",
  {
    email_id: { type: STRING, allowNull: false, unique: true, primaryKey: true },
    password: { type: STRING, allowNull: false },
    first_name: { type: STRING, allowNull: false },
    last_name: { type: STRING, allowNull: false },
    user_type: { type: ENUM("S", "C", "P", "D"), allowNull: false },
    dob: { type: DATEONLY },
    address: { type: STRING, allowNull: false },
    contact_no: { type: STRING, allowNull: false }
  }
);

User.sync().then(() => {
  console.log("User table created");
});

User.generateAuthToken = function ({ email_id, password }) {
  const token = jwt.sign({ email_id, password }, process.env.JWT_PRIVATE_KEY);
  return token;
}

module.exports = User;