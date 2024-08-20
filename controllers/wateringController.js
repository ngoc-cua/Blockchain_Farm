const WateringService = require('../services/Watering.service');
const ResponseHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const { confirmWateringSchema } = require('../validation/Watering.validation');

class WateringController {
    async confirmWatering(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmWateringSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            const { notes } = value;
            const image = req.files.Image;

            try {
                // Call WateringService to confirm watering
                const wateringEntry = await WateringService.confirmWatering({
                    notes,
                    Image: image,
                    product_code: req.body.product_code,
                    Confirmed: true // Assuming confirm is set to true
                });

                ResponseHandler.success(res, 'Watering confirmed successfully', wateringEntry);
            } catch (error) {
                console.error('Error confirming watering:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming watering');
            }

        } catch (error) {
            console.error('Error confirming watering:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming watering');
        }
    }
}

module.exports = new WateringController();
