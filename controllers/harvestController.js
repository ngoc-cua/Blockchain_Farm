const HarvestService = require('../services/HarvestServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmHarvestSchema } = require('../validation/Harvest.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class HarvestController {
    async confirmHarvest(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmHarvestSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call HarvestService to confirm the harvest
                const harvestData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming harvest is confirmed during creation
                };

                const harvestEntry = await HarvestService.confirmHarvest(harvestData);
                ResponseHandler.success(res, 'Harvest entry confirmed successfully', harvestEntry);
            } catch (error) {
                console.error('Error uploading image or confirming harvest entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the harvest entry');
            }

        } catch (error) {
            console.error('Error confirming harvest entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the harvest entry');
        }
    }
}

module.exports = new HarvestController();
