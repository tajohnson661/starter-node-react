/* eslint object-shorthand: 0 */
module.exports = function (sequelize, DataTypes) {
  const Tag = sequelize.define('tag', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        Tag.belongsToMany(models.note, { through: 'note_tags' });
      }
    }
  });
  return Tag;
};
