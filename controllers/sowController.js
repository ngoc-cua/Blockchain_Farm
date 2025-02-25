const SowService = require('../services/SowServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmSowSchema } = require('../validation/Sow.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class SowController {
    async confirmSow(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmSowSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call SowService to confirm the sow
                const sowData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming sow is confirmed during creation
                };

                const sowEntry = await SowService.confirmSow(sowData);
                ResponseHandler.success(res, 'Sow entry confirmed successfully', sowEntry);
            } catch (error) {
                console.error('Error uploading image or confirming sow entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the sow entry');
            }

        } catch (error) {
            console.error('Error confirming sow entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the sow entry');
        }
    }
}

module.exports = new SowController();
