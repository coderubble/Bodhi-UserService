const { STRING, ENUM, DATEONLY } = require("sequelize");
const { sequelize } = require("../db/database");
const jwt = require("jsonwebtoken");

const User = sequelize().define(
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
  }
);

User.sync();

User.generateAuthToken = function ({ email_id, user_type }) {
  const token = jwt.sign({ email_id, user_type }, process.env.JWT_PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

module.exports = User;