const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sequelizeFixtures = require('sequelize-fixtures');

const server = require('../../server');
const db = require('../models');

const ROOT_URL = '/api/users';

let token;

chai.use(chaiHttp);
const expect = chai.expect;
const fixturesOptions = {
  log() {
  }
};

function seedData() {
  return db.sequelize.sync({ force: true })
    .then(function () {
      return sequelizeFixtures.loadFile(path.resolve(__dirname, './fixtures/test-notes.json'), db, fixturesOptions);
    });
}

function login() {
  return new Promise(
    function (resolve, reject) {
      chai.request(server)
        .post('/api/auth/signin')
        .send({ email: 'jane@example.com', password: '1234abcd' })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          token = res.body.token;
          resolve(res);
        });
    }
  );
}
/* Mocha prefers not using arrow functions */
/* eslint prefer-arrow-callback: 0 */

describe('User Api', function () {
  beforeEach('prep data', function () {
    return seedData();
  });

  describe('me', function () {
    beforeEach('login', function () {
      return login();
    });

    it('should get logged in user data', function (done) {
      chai.request(server)
        .get(`${ROOT_URL}/me`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.email).to.equal('jane@example.com');
          done();
        });
    });
  });

  describe('me, but not logged in', function () {
    it('should not get user data if not logged in', function (done) {
      chai.request(server)
        .get(`${ROOT_URL}/me`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
