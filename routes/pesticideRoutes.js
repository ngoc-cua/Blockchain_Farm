// routes/pesticideRoutes.js
const express = require('express');
const router = express.Router();
const PesticideController = require('../controllers/pesticideController');
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/pesticide/confirm', authenticateJWT, PesticideController.confirmPesticide);
module.exports = router;
