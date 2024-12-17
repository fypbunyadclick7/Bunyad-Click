const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');  // Update with your actual database connection file

const User = sequelize.define('Users', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    PhoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Country: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    State: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    City: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Role: {
        type: DataTypes.ENUM('SuperAdmin','Admin', 'Buyer', 'Seller'),
        defaultValue: 'Buyer'
    },
    AboutMe: {
        type: DataTypes.TEXT
    },
    Active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Image: {
        type: DataTypes.STRING(255),
        defaultValue: null
    }
}, {
    timestamps: true, // Enable automatic timestamps
    tableName: 'Users',
});

module.exports = User;
