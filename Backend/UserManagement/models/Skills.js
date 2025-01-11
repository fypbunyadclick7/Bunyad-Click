const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');  // Update with your actual database connection file

const Skills = sequelize.define('Skills', {
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
    }
}, {
    timestamps: true,  // Automatically handles `CreatedAt` and `UpdatedAt`
    tableName: 'Skills'  // Ensure the table name is singular
});

module.exports = Skills;
