const { Sequelize } = require("sequelize");
const enviroment = process.env;

const sequelize = new Sequelize(
  enviroment.POSTGRES_DB,
  enviroment.POSTGRES_USER,
  enviroment.POSTGRES_PASSWORD,
  {
    host: enviroment.POSTGRES_HOST,
    dialect: "postgres"
  }
);
module.exports = sequelize;