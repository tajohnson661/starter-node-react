/* eslint object-shorthand: 0 */
module.exports = function (sequelize, DataTypes) {
  const Note = sequelize.define('note', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        Note.belongsTo(models.user);
        Note.belongsToMany(models.tag, { through: 'note_tags' });
      }
    }
  });

  return Note;
};
