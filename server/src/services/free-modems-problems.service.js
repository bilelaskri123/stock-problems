const { getModems } = require('./axia.service');
const { getModemRadiusMap, getRadiusClientsMap } = require('./radius-client.service');
const { poolAxiaProblems } = require('../config/db');

async function findFreeModemsWithNumFixe() {
    const statut = 'Libre';
    const freeModemsWithNumFixe = [];
    try {
        const { modems, page, limit, totalPages } = await getModems(1, statut);
        const freeModems = filterFreeModemsWithNumFixe(modems);
        freeModemsWithNumFixe.push(...freeModems);
        const promises = [];
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
            promises.push(getModems(currentPage, statut));
        }

        const results = await Promise.all(promises);
        for (const result of results) {
            const freeModems = filterFreeModemsWithNumFixe(result);
            freeModemsWithNumFixe.push(...freeModems);
        }
        return freeModemsWithNumFixe;
    } catch (error) {
        throw error;
    }
}



async function freeModemsWithNumFixeAndRadiusClients() {
    try {
        const radiusClientsMap = await getRadiusClientsMap();
        const modemsMap = await getModemRadiusMap();
        const freeModemsWithNumFixe = await findFreeModemsWithNumFixe();
        const freeModemsWithNumFixeAndRadiusClients = freeModemsWithNumFixe.map(modem => {
            const modemRadius = modemsMap.get(modem.NumeroSerie);
            const mac = modemRadius ? modemRadius.Mac : null;
            if (!mac) {
                return {
                    ...modem,
                    statut_radius: 'Not Found',
                    num_fixe_radius: null,
                    mac: null
                };
            }
            const radiusClient = radiusClientsMap.get(mac);
            if (!radiusClient) {
                return {
                    ...modem,
                    statut_radius: 'Not Found',
                    num_fixe_radius: null,
                    mac: mac
                };
            }

            return {
                ...modem,
                statut_radius: 'Found',
                num_fixe_radius: radiusClient ? radiusClient.telephone : null,
                mac: mac
            };
        });
        await insertFreeModemsWithNumFixeAndRadiusClientsIntoDB(freeModemsWithNumFixeAndRadiusClients);
        return freeModemsWithNumFixeAndRadiusClients;
    } catch (error) {
        console.error('Error in freeModemsWithNumFixeAndRadiusClients function:', error);
    }
}


async function insertFreeModemsWithNumFixeAndRadiusClientsIntoDB(freeModemsWithNumFixeAndRadiusClients) {
    try {
        await poolAxiaProblems.query('TRUNCATE TABLE free_modem_with_num_fixe');
        const sql = `INSERT INTO free_modem_with_num_fixe (ref_article, designation, numero_serie, code_depot, intitule, statut, code_abonnement, num_fixe, statut_radius, num_fixe_radius, mac) VALUES ?`;
        const values = freeModemsWithNumFixeAndRadiusClients.map(modem => Object.values(modem));
        // Execute the SQL query to insert data into the database
        const result = await poolAxiaProblems.query(sql, [values]);
        // return result;
    } catch (error) {
        console.error('Error in insertFreeModemsWithNumFixeAndRadiusClientsIntoDB function:', error);
    }
}


// check correspondance between axia modems and radius clients
function filterFreeModemsWithNumFixe(modems) {
    return modems.filter(modem => modem.NumFixe && modem.NumFixe.trim() !== '');
}


module.exports = {
    freeModemsWithNumFixeAndRadiusClients
}