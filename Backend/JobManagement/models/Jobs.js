const { sequelize } = require('../utils/database');  // Adjust the path as needed
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const { DataTypes } = require('sequelize');

const Jobs = sequelize.define('Jobs', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Timeline: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Status: {
        type: DataTypes.ENUM('Active', 'Pause', 'InActive', 'Assigned', 'Completed', 'Dispute', 'Canceled'),
        defaultValue: 'Active'
    },
    CategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,  // Reference to Category model
            key: 'Id'
        },
        allowNull: false
    },
    SubCategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory,  // Reference to SubCategory model
            key: 'Id'
        },
        allowNull: false
    },
    AssignedTo: {
        type: DataTypes.INTEGER,
        defaultValue: null,
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
    tableName: 'Jobs'
});

module.exports = Jobs;
