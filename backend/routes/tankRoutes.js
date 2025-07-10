const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

router.post('/users/:userId/tank', tankController.createOrUpdateTank);
router.get('/users/:userId/tank', tankController.getTankConfig);

module.exports = router;