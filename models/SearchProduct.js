const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const SearchProductCategory = sequelize.define('searchProductCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'search_product_category',
  timestamps: false,
});

module.exports = SearchProductCategory;
