const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database'); // Update with your actual database connection file

const Project = sequelize.define('Projects', {
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
    Description: {
        type: DataTypes.TEXT
    },
    Image1: {
        type: DataTypes.STRING(255)
    },
    Image2: {
        type: DataTypes.STRING(255)
    },
    Image3: {
        type: DataTypes.STRING(255)
    },
    Status: {
        type: DataTypes.ENUM('Active', 'Pause'),
        defaultValue: 'Active'
    }
}, {
    timestamps: true, // Enable automatic timestamps
    tableName: 'Projects',
});

module.exports = Project;
