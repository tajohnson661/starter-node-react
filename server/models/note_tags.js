/* eslint object-shorthand: 0 */
module.exports = function (sequelize, DataTypes) {
  const NoteTags = sequelize.define('note_tags', {
  }, {
    timestamps: false,
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });

  return NoteTags;
};
