const { Router } = require('express');
const { getRadClients } = require('../controllers/radius-client.controller');
const router = Router();

router.get('/radius-clients', getRadClients);
module.exports = router;