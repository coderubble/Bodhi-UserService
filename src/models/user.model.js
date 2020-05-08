'use strict'; 
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email_id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
    password: { type: DataTypes.STRING, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    user_type: { type: DataTypes.ENUM("S", "A", "U", "P"), allowNull: false },
    dob: { type: DataTypes.DATEONLY },
    address: { type: DataTypes.STRING, allowNull: false },
    contact_no: { type: DataTypes.STRING, allowNull: false }
  }, {});
  user.associate = function (models) {
    user.hasOne(models.clinic_user, { foreignKey: 'email_id', sourceKey: 'email_id' });
  };
  return user;
};