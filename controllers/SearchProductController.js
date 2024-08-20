const ProductService = require('../services/SearchProduct.services');

class ProductController {
  async search(req, res) {
    const { category, search } = req.body;
    const { areaId } = req.params;

    try {
      const products = await ProductService.searchProducts(category, search, areaId);
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
