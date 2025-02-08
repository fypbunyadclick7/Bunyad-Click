const { sequelize } = require('../utils/database');  // Adjust the path as needed
const { DataTypes } = require('sequelize');

const JobSkills = sequelize.define('JobSkills', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    JobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Title: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'JobSkills'
});

module.exports = JobSkills;
