const routes = require('./router/routes');
const express = require('express')
const app = express()
const PORT = process.env.PORT = 3000;

app.use('/', routes);

app.listen(PORT, function () {
    console.log('Server is running at Port ' + PORT)
})

