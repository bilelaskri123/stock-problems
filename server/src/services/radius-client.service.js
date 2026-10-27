const { pool, poolModemRadius } = require('../config/db');


async function findRadiusClients() {
    try {
        const sql = `SELECT id, Nom, telephone, Login, CIN FROM Bee_net_tn WHERE attribute = 'User-Password'`;
        const [rows, fields] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function findModemRadius() {
    try {
        const sql = `SELECT * FROM modem`;
        const [rows, fields] = await poolModemRadius.query(sql);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getRadiusClientsMap() {
    try {
        const radiusClients = await findRadiusClients();
        const radiusClientsMap = new Map();
        for (const client of radiusClients) {
            radiusClientsMap.set(client.Login, client);
        }
        return radiusClientsMap;
    } catch (error) {
        throw error;
    }
}

async function getModemRadiusMap() {
    try {
        const modems = await findModemRadius();
        const modemsMap = new Map();
        for (const modem of modems) {
            modemsMap.set(modem.SN, modem);
        }
        console.log(modemsMap.size);
        return modemsMap;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    findRadiusClients,
    findModemRadius,
    getRadiusClientsMap,
    getModemRadiusMap
}