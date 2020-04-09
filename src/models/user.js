const { STRING, CHAR } = require("sequelize");
const sequelize = require("../db/database");

const User = sequelize.define(
    "users",
    {
      user_name: STRING,
      user_type: CHAR,
      email_id: STRING,
      contact_no: STRING
    }
  );
  
  User.sync().then(() => {
    console.log('User table created')
  });


  module.exports=User