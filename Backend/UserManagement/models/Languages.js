const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database'); // Adjust the path as needed

const Language = sequelize.define('Language', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100, // Assuming Progress is a percentage
        },
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
    tableName: 'Languages',
});

module.exports = Language;
