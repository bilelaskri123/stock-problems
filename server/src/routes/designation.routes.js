const { Router } = require('express');
const { getFreeDesignation, getReservedDesignation } = require('../controllers/designation.controller');
const router = Router();

router.get('/free', getFreeDesignation);
router.get('/reserved', getReservedDesignation);

module.exports = router;