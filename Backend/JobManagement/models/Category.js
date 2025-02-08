const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Category = sequelize.define('Category', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active' // Default status is 'Active'
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
    timestamps: false,
    tableName: 'Category'
});

module.exports = Category;
