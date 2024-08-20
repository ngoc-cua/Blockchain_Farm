const CaringService = require('../services/CaringServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmCaringSchema } = require('../validation/Caring.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class CaringController {
    async confirmCaring(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmCaringSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call CaringService to confirm the caring
                const caringData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming caring is confirmed during creation
                };

                const caringEntry = await CaringService.confirmCaring(caringData);
                ResponseHandler.success(res, 'Caring entry confirmed successfully', caringEntry);
            } catch (error) {
                console.error('Error uploading image or confirming caring entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the caring entry');
            }

        } catch (error) {
            console.error('Error confirming caring entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the caring entry');
        }
    }
}

module.exports = new CaringController();
