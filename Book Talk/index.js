const express = require('express');
const expressConfig = require('./config/expressConfig');
const databaseConfig = require('./config/databaseConfig');
const { PORT } = require('./constants');
const router = require('./routes');

async function start() {

    const app = express();

    expressConfig(app);
    await databaseConfig(app);
    app.use(router)
    app.listen(PORT, () => console.log(`Application is listening on ${PORT}...`));
}


start();