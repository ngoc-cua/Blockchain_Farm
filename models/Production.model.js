const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Production extends Model {}

Production.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    farm_id: DataTypes.INTEGER,
    Product_code: DataTypes.STRING
}, { sequelize, tableName: 'production',timestamps: false });

module.exports = Production;