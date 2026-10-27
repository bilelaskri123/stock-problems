const axios = require('axios');
const https = require('https');

const apiClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const AXIA_URL = process.env.AXIA_API;

async function getListDepotActif() {
    try {
        const response = await apiClient.get(`${AXIA_URL}getAllDepotActif`);
        const depotsData = response.data;
        return depotsData['Depot'];
    } catch (error) {
        throw error;
    }
}

// depot: CodeDepot
// statut: Libre / Reservé / Sortie
async function getModems(pageNumber = 0, statut = '', depot = '') {
    try {
        let url = `${AXIA_URL}getModems?page=${pageNumber}`;
        if (statut) {
            url += `&statut=${statut}`;
        }
        if (depot) {
            url += `&depot=${depot}`;
        }
        const response = await apiClient.get(`${url}`);
        const modems = response.data['Modems'];
        const page = response.data['page'];
        const limit = response.data['limit'];
        const total = response.data['totalPages'];
        return { modems, page, limit, totalPages: total };
    } catch (error) {
        throw error;
    }
}


async function getMouvementsSerie(serialNumber) {
    try {
        const response = await apiClient.get(`${AXIA_URL}getMouvementsSerie`);
        const mouvements = response.data['Mouvements'];
        const page = response.data['page'];
        const limit = response.data['limit'];
        const total = response.data['totalLignes'];
        console.log(page, limit, total);
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getListDepotActif,
    getModems,
    getMouvementsSerie
}