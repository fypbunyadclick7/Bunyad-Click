// utils/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_ADDON_DB, 
  process.env.MYSQL_ADDON_USER, 
  process.env.MYSQL_ADDON_PASSWORD, 
  {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: 'mysql'
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL database!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { sequelize };
