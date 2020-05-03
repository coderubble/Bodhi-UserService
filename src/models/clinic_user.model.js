const { STRING } = require("sequelize");
const { sequelize } = require("../db/database");
const User = require("./user.model");

let ClinicUser ;
(async function(){
  console.log("INside function clininc user");
  
  ClinicUser= await sequelize().define(
    "clinic_users",
    {
      clinic_id: { type: STRING, allowNull: false },
      user_id: { type: STRING, allowNull: false }
    });
  await ClinicUser.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'email_id' });
  console.log("INside function clininc user:before");
  await ClinicUser.sync();
})

module.exports = ClinicUser;
