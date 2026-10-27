const { Router } = require('express');
const { exitedModems, freeModemsWithNumFixe, reservedModems } = require('../controllers/problem-crud.controller');
const router = Router();

router.get('/exited-modems', exitedModems);
router.get('/reserved-modems', reservedModems);
router.get('/free-modems-with-num-fixe', freeModemsWithNumFixe);

module.exports = router;