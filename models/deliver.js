const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deliver = sequelize.define('Deliver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Image: {
    type: DataTypes.JSON,
    allowNull: true
  },
  delivery_code: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Shipments',
      key: 'delivery_code'
    }
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'deliver',
  timestamps: false,
});

module.exports = Deliver;
