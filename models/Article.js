const { Sequelize, DataTypes } = require('sequelize');
const Category = require('../models/Category');
const { sequelize } = require('../config/database/connection');

// Usando sequeilize.define:

const Article = sequelize.define('articles', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

Category.hasMany(Article); // UMA Categoria tem MUITOS Artigos.
Article.belongsTo(Category); // UM Artigo pertence a UMA Categoria.

Article.sync();

// console.log(Article === sequelize.models.articles);

module.exports = Article;