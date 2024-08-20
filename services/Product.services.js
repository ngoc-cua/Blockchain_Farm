const Product = require('../models/Products.model');
const Production = require('../models/Production.model');
const Sow = require('../models/sow');
const Caring = require('../models/caring');
const Retailer = require('../models/retailer');
const Fertilizing = require('../models/fertilizing');
const Pesticide = require('../models/pesticide');
const FruitBagging = require('../models/fruit_bagging');
const Pruning = require('../models/pruning');
const Watering = require('../models/watering');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class ProductService {
    // Function to generate a random 12-digit number
    generateRandom12DigitNumber() {
        const min = 100000000000; // Minimum 12-digit number
        const max = 999999999999; // Maximum 12-digit number
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

async createProduct(data, areaId) {
    const transaction = await Product.sequelize.transaction();
    try {
        const productCode = this.generateRandom12DigitNumber().toString();
        const productDate = new Date().toISOString().split('T')[0];

        let imageResult = null;
        if (data.Image) {
            imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
        }

        let certifyResult = null;
        if (data.Certify) {
            certifyResult = await cloudinary.uploader.upload(data.Certify.tempFilePath);
        }

        const product = await Product.create({
            Name: data.Name,
            Description: data.Description,
            Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
            Certify: certifyResult ? JSON.stringify({ id: certifyResult.public_id, url: certifyResult.secure_url }) : null,
            product_code: productCode,
            Expiry_date: data.Expiry_date,
            Unit: data.Unit,
            Product_status: data.Product_status || 1,
            Product_date: productDate,
            Product_type: data.Product_type,
            Product_packing: data.Product_packing
        }, { transaction });

        await Production.create({
            farm_id: areaId,
            Product_code: productCode
        }, { transaction });
        await Sow.create({
            product_code: productCode,
            notes: data.notes || ''
        }, { transaction });
         await Caring.create({
                product_code: productCode,
                 notes: data.notes || ''
            }, { transaction });

            await Retailer.create({
                product_code: productCode,
                 notes: data.notes || ''
            }, { transaction });

            await Fertilizing.create({
                product_code: productCode,
                 notes: data.notes || ''
            }, { transaction });

            await Pesticide.create({
                product_code: productCode,
                 notes: data.notes || ''
            }, { transaction });

            await FruitBagging.create({
                product_code: productCode,
                 notes: data.notes || ''
            }, { transaction });

            await Pruning.create({
                product_code: productCode,
                 notes: data.notes || ''
            }, { transaction });

            await Watering.create({
                product_code: productCode,
                 notes: data.notes || ''
            }, { transaction });

        await transaction.commit();

        return product;
    } catch (error) {
        await transaction.rollback();
        throw new Error('Error creating product: ' + error.message);
    }
}

    async updateProduct(productId, data) {
        console.log(data);
        try {
            const updatedProduct = await Product.findByPk(productId);
            if (!updatedProduct) {
                throw new Error('Product not found');
            }

            // Update the product fields
            updatedProduct.Name = data.Name || updatedProduct.Name;
            updatedProduct.Descripion = data.Descripion || updatedProduct.Descripion;
            updatedProduct.Expiry_date = data.Expiry_date || updatedProduct.Expiry_date;
            updatedProduct.Unit = data.Unit || updatedProduct.Unit;
            updatedProduct.Product_type = data.Product_type || updatedProduct.Product_type;
            updatedProduct.Product_packing = data.Product_packing || updatedProduct.Product_packing;

            // Handle image update
            let imageResult = null;
            if (data.Image) {
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedProduct.Image={ id: imageResult.public_id, url: imageResult.secure_url }
            }

            // Handle certify update
            let certifyResult = null;
            if (data.Certify) {
                certifyResult = await cloudinary.uploader.upload(data.Certify.tempFilePath);
                updatedProduct.certify ={ id: certifyResult.public_id, url: certifyResult.secure_url }
            }

            // Save the updated product to the database
            await updatedProduct.save();

            return updatedProduct;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }
    async toggleProductStatus(productId) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Toggle Product_status between 1 and 2
            product.Product_status = product.Product_status === 1 ? 2 : 1;

            // Save the updated product to the database
            await product.save();

            return product;
        } catch (error) {
            throw new Error('Error toggling product status: ' + error.message);
        }
    }
    async getProductsByArea(areaId) {
        try {
            // Find all Product_code values in Production table for the given areaId
            const productions = await Production.findAll({
                where: { farm_id: areaId }
            });
    
            // Extract Product_code values
            const productCodes = productions.map(prod => prod.Product_code);
    
            // Find all products where product_code is in productCodes
            const products = await Product.findAll({
                where: { product_code: productCodes }
            });
    
            return products;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }
}

module.exports = new ProductService();
