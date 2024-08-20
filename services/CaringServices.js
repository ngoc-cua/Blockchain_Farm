const Caring = require('../models/caring');
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

class CaringService {
    async confirmCaring(data) {
        try {
             // Check if product_code is valid
            const productExists = await Product.findOne({ where: { product_code: data.product_code } });
            if (!productExists) {
                throw new Error('Invalid product code');
            }

           let imageResult = null;
            
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                const uploadedImage = await cloudinary.uploader.upload(data.Image.tempFilePath);
                // Format the image result for better readability
                imageResult = {
                    id: uploadedImage.public_id,
                    url: uploadedImage.secure_url
                };
            }

            // Create caring entry in the database
            const caringEntry = await Caring.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify(imageResult) : null,
                confirmed: data.Confirmed
            });
            return caringEntry;
        } catch (error) {
            throw new Error('Error confirming caring entry: ' + error.message);
        }
    }
}

module.exports = new CaringService();
