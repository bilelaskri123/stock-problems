const { poolAxiaProblems } = require('../config/db');
const { getListDepotActif } = require('./axia.service');

async function countModemsByDepot() {
    const reservedModemsQuery = `SELECT intitule, COUNT(*) as reserved FROM reserved_modems GROUP BY intitule`;
    const exitedModemsQuery = `SELECT intitule, COUNT(*) as exited FROM exited_modems GROUP BY intitule`;
    const freeModemsQuery = `SELECT intitule, COUNT(*) as free FROM free_modem_with_num_fixe GROUP BY intitule`;

    const reservedModemsPromise = poolAxiaProblems.query(reservedModemsQuery);
    const exitedModemsPromise = poolAxiaProblems.query(exitedModemsQuery);
    const freeModemsPromise = poolAxiaProblems.query(freeModemsQuery);

    const listDepot = await getListDepotActif();

    const [reservedModemsResult, exitedModemsResult, freeModemsResult] = await Promise.all([reservedModemsPromise, exitedModemsPromise, freeModemsPromise]);

    const reservedModems = reservedModemsResult[0];
    const freeModems = freeModemsResult[0];
    const exitedModems = exitedModemsResult[0];

    const reservedModemMap = new Map();
    const freeModemMap = new Map();
    const exitedModemMap = new Map();

    for (const freeModem of freeModems) {
        freeModemMap.set(freeModem.intitule, freeModem.free);
    }

    for (const reservedModem of reservedModems) {
        reservedModemMap.set(reservedModem.intitule, reservedModem.reserved);
    }

    for (const exitedModem of exitedModems) {
        exitedModemMap.set(exitedModem.intitule, exitedModem.exited);
    }

    const listDepotDetails = listDepot.map(depot => {
        const freeModemCount = freeModemMap.get(depot.Intitule) ?? 0;
        const reservedModemCount = reservedModemMap.get(depot.Intitule) ?? 0;
        const exitedModemCount = exitedModemMap.get(depot.Intitule) ?? 0;

        return {
            ...depot,
            'free': freeModemCount,
            'reserved': reservedModemCount,
            'exited': exitedModemCount
        }
    });

    return listDepotDetails;
}


module.exports = {
    countModemsByDepot
}