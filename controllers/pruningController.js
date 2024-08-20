const PruningService = require('../services/PruningServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmPruningSchema } = require('../validation/Pruning.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class PruningController {
    async confirmPruning(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmPruningSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call PruningService to confirm the pruning
                const pruningData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming pruning is confirmed during creation
                };

                const pruningEntry = await PruningService.confirmPruning(pruningData);
                ResponseHandler.success(res, 'Pruning entry confirmed successfully', pruningEntry);
            } catch (error) {
                console.error('Error uploading image or confirming pruning entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the pruning entry');
            }

        } catch (error) {
            console.error('Error confirming pruning entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the pruning entry');
        }
    }
}

module.exports = new PruningController();
