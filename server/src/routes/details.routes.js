const { Router } = require('express');
const { getModemsDetails } = require('../controllers/details.controller');
const router = Router();

router.get('/', getModemsDetails);

module.exports = router;