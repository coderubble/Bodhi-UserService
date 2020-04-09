const routes = require("./router/routes");
const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT = 3000;
app.use(express.json());
var options = {
  explorer: true
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use("/", routes);

app.listen(PORT, function () {
  console.log("Server is running at Port " + PORT);
});

