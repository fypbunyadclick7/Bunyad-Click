const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database'); // Update with your actual database connection file

const EmploymentHistory = sequelize.define('EmploymentHistory', {
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
        allowNull: true
    },
    Company: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    City: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    StartDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    EndDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true, // Enable automatic timestamps (CreatedAt and UpdatedAt)
    tableName: 'EmploymentHistory', // Optional, to specify the exact table name
});

module.exports = EmploymentHistory;
