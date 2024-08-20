const Sow = require('../models/sow');
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

class SowService {
    async confirmSow(data) {
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

            // Create sow entry in the database
            const sowEntry = await Sow.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                confirmed: data.Confirmed
            });

            return sowEntry;
        } catch (error) {
            throw new Error('Error confirming sow entry: ' + error.message);
        }
    }
}

module.exports = new SowService();
