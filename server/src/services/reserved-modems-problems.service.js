const { getModems } = require('./axia.service');
const { getModemRadiusMap, getRadiusClientsMap } = require('./radius-client.service');
const { poolAxiaProblems } = require('../config/db');


async function findReservedModems() {
    const statut = 'Reservé ';
    const reservedModems = [];
    try {
        const { modems, page, limit, totalPages } = await getModems(1, statut);
        reservedModems.push(...modems);
        const promises = [];
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
            promises.push(getModems(currentPage, statut));
        }
        const results = await Promise.all(promises);
        for (const result of results) {
            reservedModems.push(...result.modems);
        }
        return reservedModems;
    } catch (error) {
        throw error;
    }
}



async function reservedModemsAndRadiusClients() {
    try {
        const radiusClientsMap = await getRadiusClientsMap();
        const modemsMap = await getModemRadiusMap();
        const reservedModems = await findReservedModems();
        const reservedModemsData = reservedModems.map(modem => {

            const modemRadius = modemsMap.get(modem.NumeroSerie);
            const mac = modemRadius ? modemRadius.Mac : null;
            if (!mac) {
                return {
                    ...modem,
                    statut_radius: 'Not Found',
                    num_fixe_radius: null,
                    is_matched: null,
                    mac: null
                };
            }
            const radiusClient = radiusClientsMap.get(mac);
            if (!radiusClient) {
                return {
                    ...modem,
                    statut_radius: 'Not Found',
                    num_fixe_radius: null,
                    is_matched: null,
                    mac: mac
                };
            }

            if (!modem.NumFixe) {
                return {
                    ...modem,
                    statut_radius: 'Fixe Axia Not Found',
                    num_fixe_radius: null,
                    is_matched: null,
                    mac: null
                };
            }

            if (modem.NumFixe == radiusClient.telephone) {
                return {
                    ...modem,
                    statut_radius: 'Found',
                    num_fixe_radius: radiusClient.telephone,
                    is_matched: true,
                    mac: mac
                };
            }

            return {
                ...modem,
                statut_radius: 'Found',
                num_fixe_radius: radiusClient.telephone,
                is_matched: false,
                mac: mac
            };
        });
        await insertReservedModemsIntoDB(reservedModemsData);
        return reservedModemsData;
    } catch (error) {
        console.error('Error in exitedModemsAndRadiusClients function:', error);
    }
}


async function insertReservedModemsIntoDB(reservedModems) {
    try {
        await poolAxiaProblems.query('TRUNCATE TABLE reserved_modems;');
        await poolAxiaProblems.query('SET GLOBAL max_allowed_packet = 67108864;');
        const sql = `INSERT INTO reserved_modems (ref_article, designation, numero_serie, code_depot, intitule, statut, code_abonnement, num_fixe, statut_radius, num_fixe_radius, is_matched, mac) VALUES ?`;
        const values = reservedModems.map(modem => Object.values(modem));
        // Execute the SQL query to insert data into the database
        const result = await poolAxiaProblems.query(sql, [values]);
        // return result;
    } catch (error) {
        console.error('Error in insertReservedModemsIntoDB function:', error);
    }
}

module.exports = {
    reservedModemsAndRadiusClients
}