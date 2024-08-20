const SearchAreaCategory = require('../models/searchAreaCategory.model');
const Area = require('../models/Area.model');
const { Op } = require('sequelize');

class AreaService {
  async searchAreas(userId, categoryId, search) {
    const category = await SearchAreaCategory.findByPk(categoryId);

    if (!category) {
      throw new Error('Invalid category');
    }

    let whereClause = {
      user_id: userId,
    };

    if (search || !(categoryId == 2 || categoryId == 3)) {
      if (category.name === 'name') {
        whereClause.Name = { [Op.like]: `%${search}%` };
      } else if (category.name === 'type') {
        whereClause.Area_type = search;
      } else if (category.name === 'status') {
        whereClause.Area_status = search;
      } else {
        throw new Error('Invalid category');
      }
    }

    const areas = await Area.findAll({ where: whereClause });
    return areas;
  }
}

module.exports = new AreaService();
