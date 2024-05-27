'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Trainer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Trainer.belongsTo(models.User, { foreignKey: 'userId', as: 'isUser' })
      Trainer.hasMany(models.Record, { foreignKey: 'trainerId' })
      Trainer.hasMany(models.Comment, { foreignKey: 'trainerId' })
    }
  };
  Trainer.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    teachingStyle: DataTypes.TEXT,
    duringTime: DataTypes.STRING,
    location: DataTypes.STRING,
    appointment: DataTypes.JSON,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Trainer',
    tableName: 'Trainers',
    underscored: true
  })
  return Trainer
}
