'use strict';
module.exports = (sequelize, DataTypes) => {
  const clinic_user = sequelize.define('clinic_user', {
    clinic_id: { type: DataTypes.STRING, allowNull: false },
    email_id: { type: DataTypes.STRING, allowNull: false }
  }, {});
  return clinic_user;
};