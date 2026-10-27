const { poolAxiaProblems } = require('../config/db');

async function findExitedModems(serialNumber, status, isMatch, intitule, limit = 10, page = 1) {
    try {
        let where = '';
        page = parseInt(page);
        limit = parseInt(limit);

        if (serialNumber) {
            where = `WHERE numero_serie LIKE '%${serialNumber}%'`
        }

        if (intitule) {
            if (where.length == 0) {
                where = `WHERE intitule LIKE '%${intitule}%'`
            } else {
                where += ` and intitule LIKE '%${intitule}%'`
            }
        }

        if (status) {
            if (where.length == 0) {
                where = `WHERE statut_radius = '${status}'`
            } else {
                where += ` and statut_radius = '${status}'`
            }
        }


        if (isMatch) {
            if (where.length == 0) {
                where = `WHERE is_matched = '${isMatch}'`
            } else {
                where += ` and is_matched = '${isMatch}'`
            }
        }

        const offset = (page - 1) * limit;
        const sql = `SELECT * FROM exited_modems 
        ${where}
        ORDER BY id DESC
        LIMIT ? OFFSET ?`;
        const [rows, fields] = await poolAxiaProblems.query(sql, [limit, offset]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function findReservedModems(serialNumber, status, isMatch, intitule, limit = 10, page = 1) {
    try {
        let where = '';
        page = parseInt(page);
        limit = parseInt(limit);

        if (serialNumber) {
            where = `WHERE numero_serie LIKE '%${serialNumber}%'`
        }

        if (intitule) {
            if (where.length == 0) {
                where = `WHERE intitule LIKE '%${intitule}%'`
            } else {
                where += ` and intitule LIKE '%${intitule}%'`
            }
        }

        if (status) {
            if (where.length == 0) {
                where = `WHERE statut_radius = '${status}'`
            } else {
                where += ` and statut_radius = '${status}'`
            }
        }


        if (isMatch) {
            if (where.length == 0) {
                where = `WHERE is_matched = '${isMatch}'`
            } else {
                where += ` and is_matched = '${isMatch}'`
            }
        }

        const offset = (page - 1) * limit;
        const sql = `SELECT * FROM reserved_modems 
        ${where}
        ORDER BY id DESC
        LIMIT ? OFFSET ?`;
        const [rows, fields] = await poolAxiaProblems.query(sql, [limit, offset]);
        return rows;
    } catch (error) {
        throw error;
    }
}


async function findFreeModemsWithNumFixe(serialNumber, status, intitule, limit = 10, page = 1) {
    try {
        let where = '';
        page = parseInt(page);
        limit = parseInt(limit);

        if (serialNumber) {
            where = `WHERE numero_serie LIKE '%${serialNumber}%'`
        }

        if (intitule) {
            if (where.length == 0) {
                where = `WHERE intitule LIKE '%${intitule}%'`
            } else {
                where += ` and intitule LIKE '%${intitule}%'`
            }
        }

        if (status) {
            if (where.length == 0) {
                where = `WHERE statut_radius = '${status}'`
            } else {
                where += ` and statut_radius = '${status}'`
            }
        }

        console.log(where);

        const offset = (page - 1) * limit;
        const sql = `SELECT * FROM free_modem_with_num_fixe ${where} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows, fields] = await poolAxiaProblems.query(sql, [limit, offset]);
        return rows;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    findExitedModems,
    findReservedModems,
    findFreeModemsWithNumFixe
}