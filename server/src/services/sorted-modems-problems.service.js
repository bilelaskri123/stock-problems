const { getModems } = require('./axia.service');
const { getModemRadiusMap, getRadiusClientsMap } = require('./radius-client.service');
const { poolAxiaProblems } = require('../config/db');


async function findExitedModems() {
    const statut = 'Sortie';
    const exitedModems = [];
    try {
        const { modems, page, limit, totalPages } = await getModems(1, statut);
        exitedModems.push(...modems);
        const promises = [];
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
            promises.push(getModems(currentPage, statut));
            // const { modems } = await getModems(currentPage, statut);
            // exitedModems.push(...modems);
        }
        const results = await Promise.all(promises);
        for (const result of results) {
            exitedModems.push(...result.modems);
        }
        return exitedModems;
    } catch (error) {
        throw error;
    }
}



async function exitedModemsAndRadiusClients() {
    try {
        const radiusClientsMap = await getRadiusClientsMap();
        const modemsMap = await getModemRadiusMap();
        const exitedModems = await findExitedModems();
        const exitedModemsAndRadiusClients = exitedModems.map(modem => {

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
        await insertExitedModemsIntoDB(exitedModemsAndRadiusClients);
        return exitedModemsAndRadiusClients;
    } catch (error) {
        console.error('Error in exitedModemsAndRadiusClients function:', error);
    }
}


async function insertExitedModemsIntoDB(exitedModems) {
    try {
        await poolAxiaProblems.query('TRUNCATE TABLE exited_modems;');
        await poolAxiaProblems.query('SET GLOBAL max_allowed_packet = 67108864;');
        const sql = `INSERT INTO exited_modems (ref_article, designation, numero_serie, code_depot, intitule, statut, code_abonnement, num_fixe, statut_radius, num_fixe_radius, is_matched, mac) VALUES ?`;
        const values = exitedModems.map(modem => Object.values(modem));
        // Execute the SQL query to insert data into the database
        const result = await poolAxiaProblems.query(sql, [values]);
        // return result;
    } catch (error) {
        console.error('Error in insertExitedModemsIntoDB function:', error);
    }
}

module.exports = {
    exitedModemsAndRadiusClients
}