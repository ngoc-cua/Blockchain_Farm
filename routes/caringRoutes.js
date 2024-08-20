// routes/harvestRoutes.js
const express = require('express');
const router = express.Router();
const CaringController = require('../controllers/caringController'); // Updated controller import
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/caring/confirm', authenticateJWT, CaringController.confirmCaring);

module.exports = router;
