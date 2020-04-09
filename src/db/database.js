const Sequelize = require("sequelize");
const DATABASE_URL = "postgres://postgres:mysecretpassword@192.168.99.100:5432/userdb";
const sequelize = new Sequelize(DATABASE_URL);
module.exports = sequelize;