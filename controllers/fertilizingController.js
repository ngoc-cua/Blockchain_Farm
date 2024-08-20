const FertilizingService = require('../services/fertilizingServices'); // Updated service import
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmFertilizingSchema } = require('../validation/Fertilizing.validation'); // Updated schema import
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class FertilizingController {
    async confirmFertilizing(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmFertilizingSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call FertilizingService to confirm the fertilizing
                const fertilizingData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming fertilizing is confirmed during creation
                };

                const fertilizingEntry = await FertilizingService.confirmFertilizing(fertilizingData);
                ResponseHandler.success(res, 'Fertilizing entry confirmed successfully', fertilizingEntry);
            } catch (error) {
                console.error('Error uploading image or confirming fertilizing entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the fertilizing entry');
            }

        } catch (error) {
            console.error('Error confirming fertilizing entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the fertilizing entry');
        }
    }
}

module.exports = new FertilizingController();
