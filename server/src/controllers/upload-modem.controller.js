const { uploadRadiusModems } = require('../services/upload-modem.service');

async function uploadModem(req, res, next) {
    try {
        const type = req.body.type;
        const filename = req.file.filename;
        await uploadRadiusModems(type, filename);
        res.status(201).json({ message: 'list uploaded' })
    } catch (error) {
        res.status(500).json({ error: 'error upload file' });
    }
}



module.exports = {
    uploadModem
}