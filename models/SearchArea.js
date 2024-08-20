const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const SearchAreaCategory = sequelize.define('SearchAreaCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(299),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'search_area_category',
  timestamps: false
});

module.exports = SearchAreaCategory;
