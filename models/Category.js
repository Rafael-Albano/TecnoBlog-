const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database/connection');

// Modelo de extensão.

// class Category extends Model{}

const Category = sequelize.define('categories', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  },

  
});

Category.sync();

// console.log(Category === sequelize.models.Category); 

module.exports = Category;