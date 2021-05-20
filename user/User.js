const { Sequelize, DataTypes, Model} = require('sequelize');
const { sequelize } = require('../config/database/connection');

const User = sequelize.define('users', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passworld: {
    type: DataTypes.STRING,
    allowNull: false
  }

});

User.sync();

module.exports = User;