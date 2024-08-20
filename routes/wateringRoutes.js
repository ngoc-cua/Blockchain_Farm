// routes/wateringRoutes.js
const express = require('express');
const router = express.Router();
const WateringController = require('../controllers/wateringController');
const authenticateJWT = require('../utils/authenticateJWT');
router.post('/watering/confirm', authenticateJWT, WateringController.confirmWatering);
module.exports = router;
