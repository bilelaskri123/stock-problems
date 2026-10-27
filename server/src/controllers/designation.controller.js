const { freeDesignation, reservedDesignation } = require('../services/designation.service');
async function getFreeDesignation(req, res) {
    try {
        const intitule = req.query.intitule;
        const freeDesignations = await freeDesignation(intitule);
        res.status(200).send(freeDesignations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server error' })
    }
}

async function getReservedDesignation(req, res) {
    try {
        const intitule = req.query.intitule;
        const reservedDesignations = await reservedDesignation(intitule);
        res.status(200).send(reservedDesignations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server error' })
    }
}


module.exports = {
    getFreeDesignation,
    getReservedDesignation
}