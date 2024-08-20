const Deliver = require('../models/deliver');
const Shipment=require('../models/shipment')
const cloudinary = require('cloudinary').v2;

class DeliverService {
 async confirmDeliver(data) {
     try {
                 // Check if the delivery_code is valid
            const existingDelivery = await Shipment.findOne({ where: { delivery_code: data.delivery_code } });
            if (!existingDelivery) {
                throw new Error('Invalid delivery code');
            }
            let imageResult = null;
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                console.log('Uploading image:', data.Image.tempFilePath); // Debugging
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                console.log('Image uploaded:', imageResult); // Debugging
            }

            // Create delivery entry in the database
            const deliverEntry = await Deliver.create({
                delivery_code: data.delivery_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                confirmed: data.Confirmed
            });

            return deliverEntry;
        } catch (error) {
            console.error('Error in DeliverService:', error);
            throw new Error('Error confirming delivery entry: ' + error.message);
        }
    }
}

module.exports = new DeliverService();
