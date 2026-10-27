const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const helmet = require("helmet");
const cron = require('node-cron');

const { freeModemsWithNumFixeAndRadiusClients } = require('./services/free-modems-problems.service');
const { exitedModemsAndRadiusClients } = require('./services/sorted-modems-problems.service');
const { reservedModemsAndRadiusClients } = require('./services/reserved-modems-problems.service');

const { errorHandler, notFoundHandler } = require('./middlewares/error');

const app = express();


// crons
cron.schedule('31 * * * *', async () => {
    try {
        console.log('Cron Free Modems');
        await freeModemsWithNumFixeAndRadiusClients();
        console.log('End Free Modems')
    } catch (error) {
        console.log('error: ', error)
    }
});

cron.schedule('53 * * * *', async () => {
    try {
        console.log('Cron Exited Modems');
        await exitedModemsAndRadiusClients();
        console.log('End Exited Modems')
    } catch (error) {
        console.log('error: ', error)
    }
});

cron.schedule('5 * * * *', async () => {
    try {
        console.log('Cron Reserved Modems');
        await reservedModemsAndRadiusClients();
        console.log('End Reserved Modems')
    } catch (error) {
        console.log('error: ', error)
    }
});

// Enable CORS and logging
app.use(cors());
app.use(morgan("dev"));
// Security headers
app.use(helmet());
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import routes
const routes = require("./routes");
app.use("/api", routes);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
});

// not found handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

module.exports = app;