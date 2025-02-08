// models/Bids.js
const { Model } = require('sequelize');
const { sequelize } = require('../utils/database'); // Adjust the path according to your project structure
const { DataTypes } = require('sequelize');
class Bids extends Model {}

Bids.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    JobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    Duration: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    CoverLetter: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
        defaultValue: 'Pending',
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
    sequelize,
    modelName: 'Bids',
    tableName: 'Bids',
    timestamps: false,
});

module.exports = Bids;
