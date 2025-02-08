// models/BidAttachments.js
const { Model } = require('sequelize');
const { sequelize } = require('../utils/database'); // Adjust the path according to your project structure
const { DataTypes } = require('sequelize');
const Bids = require('./Bids');

class BidAttachments extends Model {}

BidAttachments.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    BidId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Bids,
            key: 'Id'
        },
        onDelete: 'CASCADE'
    },
    FileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'BidAttachments',
    tableName: 'BidAttachments',
    timestamps: false,
});

module.exports = BidAttachments;
