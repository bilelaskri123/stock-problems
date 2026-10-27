const { Router } = require('express');
const router = Router();
const { upload } = require('../helpers/multer');
const { uploadModem } = require('../controllers/upload-modem.controller');

router.post('/', upload.single('excelFile'), uploadModem);

module.exports = router;