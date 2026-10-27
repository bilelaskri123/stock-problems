const { poolAxiaProblems } = require('../config/db');
async function freeDesignation(intitule) {
    const query = `SELECT count(*) as total, designation FROM free_modem_with_num_fixe WHERE intitule = '${intitule}' GROUP BY designation`;
    const result = await poolAxiaProblems.query(query);
    return result[0];
}


async function reservedDesignation(intitule) {
    const query = `SELECT count(*) as total, designation FROM reserved_modems WHERE intitule = '${intitule}' GROUP BY designation`;
    const result = await poolAxiaProblems.query(query);
    return result[0];
}


module.exports = {
    freeDesignation,
    reservedDesignation
}