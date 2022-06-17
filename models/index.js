const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('./user');
const Movie = require('./movie');

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
    dialectOptions: { charset: 'utf8mb4', dateStrings: true, typeCast: true },
    timezone: '+09:00',
  }
);

db.sequelize = sequelize;
db.User = User;
db.Movie = Movie;

User.init(sequelize);
Movie.init(sequelize);

User.associate(db);
Movie.associate(db);

module.exports = db;
