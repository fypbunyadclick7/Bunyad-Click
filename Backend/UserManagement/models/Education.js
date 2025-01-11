const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database'); // Update with your actual database connection file

const Education = sequelize.define('Education', {
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
    StartDate: {
        type: DataTypes.DATE
    },
    EndDate: {
        type: DataTypes.DATE
    },
    SchoolName: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: true, // Enables automatic timestamps (CreatedAt, UpdatedAt)
    tableName: 'Education', // Specify the table name
});

module.exports = Education;
