const { getRadiusClients } = require('../services/radius-client.service');

async function getRadClients(req, res) {
    try {
        const radiusClients = await getRadiusClients();
        const radiusClientsMap = new Map();
        for (const client of radiusClients) {
            radiusClientsMap.set(client.Login, client);
        }
        return res.status(200).send(radiusClients);
    } catch (error) {
        res.status(500).json({ error: 'server error' })
    }
}

module.exports = {
    getRadClients
}