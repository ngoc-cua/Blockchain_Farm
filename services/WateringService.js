const Watering = require('../models/watering');
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class WateringService {
    async confirmWatering(data) {
        try {
            // Check if the product_code is valid
            const productExists = await Product.findOne({ where: { product_code: data.product_code } });
            if (!productExists) {
                throw new Error('Invalid product code');
            }

            // Upload image to Cloudinary if an image file is provided
            let imageResult = null;
            if (data.Image) {
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
            }

            // Create watering entry in the database
            const wateringEntry = await Watering.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                confirmed: data.Confirmed || false // Assuming Confirmed is set to false if not provided
            });

            return wateringEntry;
        } catch (error) {
            throw new Error('Error confirming watering entry: ' + error.message);
        }
    }
}

module.exports = new WateringService();
