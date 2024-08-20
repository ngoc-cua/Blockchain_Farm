const express = require('express');
const router = express.Router();
const AreaController = require('../Controller/SearchArea.controller');
const ProductController= require('../Controller/SearchProduct.controller')
const authenticateJWT = require('../utils/authenticateJWT');

// POST /api/areas - Create a new area
router.use(authenticateJWT)

router.post('/area', AreaController.search);
router.post('/:areaId/product', ProductController.search);

module.exports = router;
