const express = require('express');
const router = express.Router();
const SowController = require('../controllers/sowController'); 
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/sow/confirm', authenticateJWT, SowController.confirmSow);  

module.exports = router;
