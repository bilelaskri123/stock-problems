const { Router } = require('express');
const { getFreeModemsWithNumFixe, getExitedModems, getReservedModems } = require('../controllers/axia.problem.controller');
const router = Router();

router.get('/free-modems-with-num-fixe', getFreeModemsWithNumFixe);
router.get('/exited-modems', getExitedModems);
router.get('/reserved-modems', getReservedModems);

module.exports = router;