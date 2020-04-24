const {Sequelize} = require("sequelize");
const enviroment = process.env;

const sequelize = new Sequelize(enviroment.DB_NAME,
  enviroment.DB_USER,
  enviroment.DB_PASSWORD, {
  host: enviroment.HOST,
  dialect: "postgres"
});
module.exports = sequelize;