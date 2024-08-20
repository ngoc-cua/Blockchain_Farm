const Pruning = require('../models/pruning');
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

class PruningService {
    async confirmPruning(data) {
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

            // Create pruning entry in the database
            const pruningEntry = await Pruning.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                confirmed: data.Confirmed
            });

            return pruningEntry;
        } catch (error) {
            throw new Error('Error confirming pruning entry: ' + error.message);
        }
    }
}

module.exports = new PruningService();
