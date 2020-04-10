const routes = require("./router/routes");
const express = require("express");
const app = express();
const PORT = process.env.PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const expressValidator = require('express-validator')

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.use("/", routes);

app.listen(PORT, function () {
  console.log("Server is running at Port " + PORT);
});

