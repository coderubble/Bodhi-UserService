'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('clinic_users', {
      clinic_id: { type: DataTypes.STRING, allowNull: false },
      email_id: { type: DataTypes.STRING, allowNull: false }
    });
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('clinic_users');
  }
};