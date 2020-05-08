'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('users', {
      email_id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
      password: { type: DataTypes.STRING, allowNull: false },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      user_type: { type: DataTypes.ENUM("S", "A", "U", "P"), allowNull: false },
      dob: { type: DataTypes.DATEONLY },
      address: { type: DataTypes.STRING, allowNull: false },
      contact_no: { type: DataTypes.STRING, allowNull: false }
    });
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('users');
  }
};