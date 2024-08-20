// routes/fertilizingRoutes.js
const express = require('express');
const router = express.Router();
const FertilizingController = require('../controllers/fertilizingController'); // Updated controller import
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/fertilizing/confirm', authenticateJWT, FertilizingController.confirmFertilizing);

module.exports = router;
