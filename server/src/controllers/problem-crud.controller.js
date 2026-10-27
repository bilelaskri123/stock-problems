const { findExitedModems, findFreeModemsWithNumFixe, findReservedModems } = require('../services/problem-crud.service');

async function exitedModems(req, res) {
    try {
        const { limit, page, serialNumber, status, isMatch, intitule } = req.query;
        let exitedModems = await findExitedModems(serialNumber, status, isMatch, intitule, limit, page);
        res.json(exitedModems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function reservedModems(req, res) {
    try {
        const { limit, page, serialNumber, status, isMatch, intitule } = req.query;
        let reservedModems = await findReservedModems(serialNumber, status, isMatch, intitule, limit, page);
        res.json(reservedModems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function freeModemsWithNumFixe(req, res) {
    try {
        const { limit, page, serialNumber, status, intitule } = req.query;
        let freeModemsWithNumFixe = await findFreeModemsWithNumFixe(serialNumber, status, intitule, limit, page);
        res.json(freeModemsWithNumFixe);
    } catch (error) {
        console.error('Error fetching free modems with num fixe:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    exitedModems,
    reservedModems,
    freeModemsWithNumFixe
};