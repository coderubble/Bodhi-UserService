const { STRING } = require("sequelize");
const { sequelize } = require("../db/database");
const User = require("./user.model");

const ClinicUser = sequelize().define("clinic_users", {
  clinic_id: { type: STRING, allowNull: false },
  email_id: { type: STRING, allowNull: false }
});
ClinicUser.belongsTo(User, { foreignKey: 'email_id', sourceKey: 'email_id' });
ClinicUser.sync();

module.exports = ClinicUser;
