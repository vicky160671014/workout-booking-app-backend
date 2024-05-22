'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Record.belongsTo(models.User, { foreignKey: 'userId' })
      Record.belongsTo(models.Trainer, { foreignKey: 'trainerId' })
    }
  };
  Record.init({
    start_time: DataTypes.STRING,
    during_time: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    trainer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Record',
    tableName: 'Records',
    underscored: true
  })
  return Record
}
