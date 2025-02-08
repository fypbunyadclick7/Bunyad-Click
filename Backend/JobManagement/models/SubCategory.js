const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const SubCategory = sequelize.define('SubCategory', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    tableName: 'SubCategory'
});

module.exports = SubCategory;
