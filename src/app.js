const routes = require("./controller/routes");
const models = require("./models")
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
models.clinic_user.belongsTo(models.user, { foreignKey: 'email_id', sourceKey: 'email_id' });
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.use(process.env.API_PREFIX, routes);
models.sequelize.sync().then(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, function () {
      console.log(`Server was started on Port ${PORT}`);
    });
  }
});
module.exports = app;
