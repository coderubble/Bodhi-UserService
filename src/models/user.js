const { STRING, CHAR,ENUM } = require("sequelize");
const sequelize = require("../db/database");

const User = sequelize.define(
  "users",
  {
    user_name:{type: STRING,allowNull:false,unique:true,primaryKey: true},
    user_type: {type: ENUM('S', 'C','P'),allowNull:false},
    email_id: {type: STRING,allowNull:false,unique:true},
    contact_no: {type: STRING,allowNull:false}
  }
);
User.sync().then(() => {
  console.log('User table created')
});

module.exports = User