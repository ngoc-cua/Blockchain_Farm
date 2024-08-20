const AreaService = require('../services/SearchArea.services');
const jwt = require('jsonwebtoken');
const ResponseHandler = require('../utils/ErrorHandler');

class AreaController {
  async search(req, res) {
    const { category, search } = req.body;

    try {
      const token = req.headers.authorization;
      if (!token) {
        return ResponseHandler.unauthorized(res, 'Authorization token is missing');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const areas = await AreaService.searchAreas(userId, category, search);
      ResponseHandler.success(res, 'Areas fetched successfully', areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
      ResponseHandler.serverError(res, 'An error occurred while fetching areas');
    }
  }
}

module.exports = new AreaController();
