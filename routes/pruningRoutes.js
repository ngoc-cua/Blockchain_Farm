// routes/pruningRoutes.js
const express = require('express');
const router = express.Router();
const PruningController = require('../controllers/pruningController');
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/pruning/confirm', authenticateJWT, PruningController.confirmPruning);

module.exports = router;
