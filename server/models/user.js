/* eslint object-shorthand: 0 */
const bcrypt = require('bcrypt');

const convertToHash = (user, options) => {
  return new Promise(
    (resolve, reject) => {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          reject('Failure');
        }
        user.password = hash;
        resolve(hash);
      });
    }
  );
};

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['email']
      }
    ],
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        User.hasMany(models.note);
      }
    }
  });

  User.hook('beforeCreate', convertToHash);
  User.hook('beforeUpdate', convertToHash);

  return User;
};

