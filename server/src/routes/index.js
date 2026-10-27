const { Router } = require('express');
const router = Router();
const RadiusRoutes = require('./radius-client.routes');
const AxiaRoutes = require('./axia.problem.routes');
const UploadRadiusRoutes = require('./upload-radius.routes');
const ProblemCrudRoutes = require('./problem-crud.routes');
const DetailsRoutes = require('./details.routes');
const DesignationRoutes = require('./designation.routes');

router.use('/radius', RadiusRoutes);
router.use('/upload-modems', UploadRadiusRoutes);
router.use('/axia', AxiaRoutes);
router.use('/problems', ProblemCrudRoutes);
router.use('/details', DetailsRoutes);
router.use('/designation', DesignationRoutes)

module.exports = router;