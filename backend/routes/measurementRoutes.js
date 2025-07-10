const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

router.post('/measurements', measurementController.addMeasurement);
router.get('/measurements', measurementController.getMeasurements);
router.get('/tanks/:tankId/status', measurementController.getCurrentStatus);
router.get('/consumption-average', measurementController.getConsumptionAverage);

module.exports = router;