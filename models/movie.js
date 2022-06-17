const Sequelize = require('sequelize');

module.exports = class Movie extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        imgUrl: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        videoUrl: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        category: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        director: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        writer: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        actor: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Movie',
        tableName: 'movies',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Movie.belongsTo(db.User);
    db.Movie.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Movie.belongsToMany(db.User, { through: 'Mylist', as: 'Lister' });
  }
};
