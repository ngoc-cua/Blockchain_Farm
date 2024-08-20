const Fertilizing = require('../models/fertilizing'); // Updated model import
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

class FertilizingService {
    async confirmFertilizing(data) { // Updated method name
        try {
            // Check if product_code is valid
            const productExists = await Product.findOne({ where: { product_code: data.product_code } });
            if (!productExists) {
                throw new Error('Invalid product code');
            }

            let imageResult = null;
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
            }

            // Create fertilizing entry in the database
            const fertilizingEntry = await Fertilizing.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                confirmed: data.Confirmed
            });

            return fertilizingEntry;
        } catch (error) {
            throw new Error('Error confirming fertilizing entry: ' + error.message);
        }
    }
}

module.exports = new FertilizingService();
