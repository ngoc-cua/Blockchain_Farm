const express = require('express');
const router = express.Router();
const FruitBaggingController = require('../controllers/fruit_baggingController'); 
const authenticateJWT = require('../utils/authenticateJWT');

router.post('/fruit_bagging/confirm', authenticateJWT, FruitBaggingController.confirmFruitBagging); 

module.exports = router;
