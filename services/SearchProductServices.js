const Product = require("../models/Products.model");
const SearchProductCategory = require("../models/searchProductCategory.model");
const Production = require("../models/Production.model"); // Assuming you have a Production model
const { Op } = require("sequelize");

class ProductService {
  async searchProducts(categoryId, search, areaId) {
    const category = await SearchProductCategory.findByPk(categoryId);

    if (!category) {
      throw new Error("Invalid category");
    }

    let whereClause = {};

    if (search || !(categoryId == 2 || categoryId == 3)) {
      if (category.name === "name") {
        whereClause = { Name: { [Op.like]: `%${search}%` } };
      } else if (category.name === "type") {
        whereClause = { Product_type: search };
      } else if (category.name === "status") {
        whereClause = { Product_status: search };
      } else {
        throw new Error("Invalid category");
      }
    }

    // If areaId is provided, filter products by area
    if (areaId) {
      const productions = await Production.findAll({
        where: { farm_id: areaId },
      });
      const productCodes = productions.map((prod) => prod.Product_code);
      whereClause.product_code = { [Op.in]: productCodes };
    }

    const products = await Product.findAll({ where: whereClause });
    return products;
  }
}

module.exports = new ProductService();
