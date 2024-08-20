const PesticideService = require('../services/PesticideServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmPesticideSchema } = require('../validation/Pesticide.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class PesticideController {
    async confirmPesticide(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmPesticideSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call PesticideService to confirm the pesticide
                const pesticideData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming pesticide is confirmed during creation
                };

                const pesticideEntry = await PesticideService.confirmPesticide(pesticideData);
                ResponseHandler.success(res, 'Pesticide entry confirmed successfully', pesticideEntry);
            } catch (error) {
                console.error('Error uploading image or confirming pesticide entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the pesticide entry');
            }

        } catch (error) {
            console.error('Error confirming pesticide entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the pesticide entry');
        }
    }
}

module.exports = new PesticideController();
