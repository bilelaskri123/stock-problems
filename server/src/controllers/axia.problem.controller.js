const { freeModemsWithNumFixeAndRadiusClients } = require('../services/free-modems-problems.service');
const { exitedModemsAndRadiusClients } = require('../services/sorted-modems-problems.service');
const { reservedModemsAndRadiusClients } = require('../services/reserved-modems-problems.service');

async function getFreeModemsWithNumFixe(req, res) {
    try {
        const freeModemsWithNumFixeAndRadiusClientsResult = await freeModemsWithNumFixeAndRadiusClients();
        return res.status(200).send(freeModemsWithNumFixeAndRadiusClientsResult);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'server error' });
    }
}

async function getReservedModems(req, res) {
    try {
        const reservedModemsAndRadiusClientsResult = await reservedModemsAndRadiusClients();
        return res.status(200).send(reservedModemsAndRadiusClientsResult);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'server error' });
    }
}

async function getExitedModems(req, res) {
    try {
        const exitedModemsAndRadiusClientsResult = await exitedModemsAndRadiusClients();
        return res.status(200).send(exitedModemsAndRadiusClientsResult);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'server error' });
    }
}

module.exports = {
    getFreeModemsWithNumFixe,
    getExitedModems,
    getReservedModems
}