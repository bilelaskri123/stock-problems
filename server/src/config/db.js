const mysql = require('mysql2/promise');

const { RADUIS_HOST_DB,
    RADUIS_USER_DB,
    RADUIS_DATABASE_DB,
    RADUIS_PORT_DB,
    RADUIS_PASSWORD_DB } = process.env;


const { DARK_HOST,
    DARK_USER,
    DARK_DB,
    DARK_PORT,
    DARK_PASSWORD } = process.env;


const pool = mysql.createPool({
    host: RADUIS_HOST_DB,
    user: RADUIS_USER_DB,
    database: RADUIS_DATABASE_DB,
    port: RADUIS_PORT_DB || 3306,
    password: RADUIS_PASSWORD_DB,
    waitForConnections: true,
    connectionLimit: 10, // Max connections to open at once
    queueLimit: 0
});


const poolModemDark = mysql.createPool({
    host: DARK_HOST,
    user: DARK_USER,
    database: DARK_DB,
    port: DARK_PORT || 3306,
    password: DARK_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10, // Max connections to open at once
    queueLimit: 0
});

const poolModemRadius = mysql.createPool({
    host: process.env.MODEM_HOST,
    user: process.env.MODEM_USER,
    database: process.env.MODEM_DB,
    port: process.env.MODEM_PORT || 3306,
    password: process.env.MODEM_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10, // Max connections to open at once
    queueLimit: 0
});

const AXIA_PROBLEMS_HOST = DARK_HOST;
const AXIA_PROBLEMS_USER = DARK_USER;
const AXIA_PROBLEMS_DB = process.env.AXIA_PROBLEMS_DB;
const AXIA_PROBLEMS_PORT = DARK_PORT || 3306;
const AXIA_PROBLEMS_PASSWORD = DARK_PASSWORD;

const poolAxiaProblems = mysql.createPool({
    host: AXIA_PROBLEMS_HOST,
    user: AXIA_PROBLEMS_USER,
    database: AXIA_PROBLEMS_DB,
    port: AXIA_PROBLEMS_PORT || 3306,
    password: AXIA_PROBLEMS_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10, // Max connections to open at once
    queueLimit: 0
});






module.exports = { pool, poolModemDark, poolModemRadius, poolAxiaProblems };