const { countModemsByDepot } = require('../services/details.service');
async function getModemsDetails(req, res) {
    try {
        const modemDetails = await countModemsByDepot();
        res.status(200).send(modemDetails);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server error' })
    }
}


module.exports = {
    getModemsDetails
}