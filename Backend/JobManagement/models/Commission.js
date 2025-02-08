const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database'); // Make sure to replace this with your actual sequelize instance

const Commission = sequelize.define('Commission', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Percent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
},
UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
}
}, {
  tableName: 'Commission', // Set table name explicitly
  timestamps: false,       // Disable automatic timestamp fields by Sequelize
});

module.exports = Commission;
