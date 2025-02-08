const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database"); // Import the sequelize instance

const Offer = sequelize.define(
  "Offer",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    JobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    DeliveryDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Revisions: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    ExpiryDays: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    Status: {
      type: DataTypes.ENUM("Active", "Rejected", "Accepted"),
      defaultValue: "Active",
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Disable automatic timestamp management by Sequelize (we have custom fields)
    tableName: "Offers", // Define the table name
  }
);

module.exports = Offer;
