const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const params = ['tecnoBlog', 'root', '*****'];
const host = 'localhost';
const dialect = 'mysql';
const timezone = '-03:00';

const sequelize = new Sequelize(...params, { host, dialect,timezone } );
  
module.exports = { sequelize, DataTypes, Model, Op };
  