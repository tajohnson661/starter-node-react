'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return new Promise(
      function (resolve, reject) {
        queryInterface.createTable('users', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
          },
          firstName: {
            type: Sequelize.STRING
          },
          lastName: {
            type: Sequelize.STRING
          },
          email: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING
          },
          password: {
            type: Sequelize.STRING
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        })
          .then(() => {
              queryInterface.addIndex('users', ['email'], {
                indicesType: 'UNIQUE'
              })
                .then((data) => {
                  resolve(data);
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            }
          )
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
