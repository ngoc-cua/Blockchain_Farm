// routes/harvestRoutes.js
const express = require('express');
const router = express.Router();
const HarvestController = require('../controllers/harvestController'); // Updated controller import
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/harvest/confirm', authenticateJWT, HarvestController.confirmHarvest);
module.exports = router;
