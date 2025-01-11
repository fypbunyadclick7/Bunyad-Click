const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');  // Update with your actual database connection file

const Profile = sequelize.define('Profile', {
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
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Visibility: {
        type: DataTypes.ENUM('Public', 'Private'),
        defaultValue: 'Public'
    }
}, {
    timestamps: true,  // Automatically adds `CreatedAt` and `UpdatedAt`
    tableName: 'Profile'  // Ensure the table name is singular
});

module.exports = Profile;
