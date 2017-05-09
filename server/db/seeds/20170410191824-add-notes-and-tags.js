const path = require('path');
const sequelizeFixtures = require('sequelize-fixtures');

const db = require('../../models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return new Promise(
      function (resolve, reject) {
        sequelizeFixtures.loadFile(path.resolve(__dirname, './fixtures/notesandtags_seed.json'), db)
          .then((data) => {
              resolve(data)
            }
          )
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
  },

  down: function (queryInterface, Sequelize) {
    /*
     Add reverting commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.bulkDelete('Person', null, {});
     */
  }
}
;
