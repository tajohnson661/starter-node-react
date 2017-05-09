const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sequelizeFixtures = require('sequelize-fixtures');

const server = require('../../server');
const db = require('../models');

const ROOT_URL = '/api/notes';
const KNOWN_ID = 'e7acdf59-ce62-43cc-87ee-61aa76e786bf';
const UNKNOWN_ID = '11111111-ce62-43cc-87ee-61aa76e786bf';

let token;
let loggedInUser;

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
          loggedInUser = res.body.user;
          resolve(res);
        });
    }
  );
}
/* Mocha prefers not using arrow functions */
/* eslint prefer-arrow-callback: 0 */

describe('Notes Api', function () {
  beforeEach('prep notes data', function () {
    return seedData();
  });


  describe('create', function () {
    beforeEach('login', function () {
      return login();
    });

    it('should create a note', function (done) {
      chai.request(server)
        .post(`${ROOT_URL}`)
        .set('authorization', token)
        .send({ text: 'hi there' })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.text).to.equal('hi there');
          expect(res.body.userId).to.equal(loggedInUser.id);
          done();
        });
    });

    it('should create a note and add an existing tag', function (done) {
      chai.request(server)
        .post(`${ROOT_URL}`)
        .set('authorization', token)
        .send({ text: 'hi there', tags: ['b216117b-d684-4875-96ff-8c42636e3f4d'] })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.text).to.equal('hi there');
          expect(res.body.tags).to.be.an('array');
          expect(res.body.tags[0]).to.be.an('object');
          expect(res.body.tags[0].name).to.equal('programming');
          expect(res.body.userId).to.equal(loggedInUser.id);
          done();
        });
    });

    it('should create data and then find it', function (done) {
      chai.request(server)
        .post(`${ROOT_URL}`)
        .set('authorization', token)
        .send({ text: 'hi there' })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          const id = res.body.id;
          chai.request(server)
            .get(`/api/notes/${id}`)
            .set('authorization', token)
            .end(function (err, res) {
              expect(res).to.be.json;
              expect(res.body).to.be.an('object');
              expect(res.body.text).to.equal('hi there');
              done();
            });
        });
    });
  });

  describe('list', function () {
    describe('no access if not logged in', function () {
      it('should not be able to retrieve data if not logged in', function (done) {
        chai.request(server)
          .get(`${ROOT_URL}`)
          .end(function (err, res) {
            expect(res).to.have.status(401);
            done();
          });
      });
    });

    describe('list', function () {
      beforeEach('login', function () {
        return login();
      });

      it('should retrieve data', function (done) {
        chai.request(server)
          .get(`${ROOT_URL}`)
          .set('authorization', token)
          .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            const oldestNote = res.body[1];
            expect(oldestNote).to.be.an('object');
            expect(oldestNote.text).to.equal('this is some note text');
            // Make sure we also retrieve any tags for the note
            expect(oldestNote.tags).to.be.an('array');
            expect(oldestNote.tags).to.have.lengthOf(2);
            expect(oldestNote.tags[0].name).to.equal('leisure');
            done();
          });
      });

      it('should retrieve data by user id', function (done) {
        chai.request(server)
          .get(`${ROOT_URL}?userId=${loggedInUser.id}`)
          .set('authorization', token)
          .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0].text).to.equal('this is some note text');
            done();
          });
      });
    });
  });

  describe('read', function () {
    beforeEach('login', function () {
      return login();
    });

    it('should retrieve a note by id', function (done) {
      chai.request(server)
        .get(`${ROOT_URL}/${KNOWN_ID}`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.text).to.equal('this is some note text');
          // Make sure we also retrieve any tags for the note
          expect(res.body.tags).to.be.an('array');
          expect(res.body.tags).to.have.lengthOf(2);
          expect(res.body.tags[0].name).to.equal('leisure');
          done();
        });
    });

    it('should fail on retrieving a note with unknown id', function (done) {
      chai.request(server)
        .get(`${ROOT_URL}/${UNKNOWN_ID}`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe('update', function () {
    beforeEach('login', function () {
      return login();
    });

    it('should update a note by id and tags should still be there', function (done) {
      chai.request(server)
        .put(`${ROOT_URL}/${KNOWN_ID}`)
        .set('authorization', token)
        .send({ text: 'hi there' })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.text).to.equal('hi there');
          expect(res.body.tags).to.be.an('array');
          expect(res.body.tags).to.have.lengthOf(2);
          expect(res.body.tags[0].name).to.equal('leisure');
          done();
        });
    });

    it('should update a note by id and update tags', function (done) {
      chai.request(server)
        .put(`${ROOT_URL}/${KNOWN_ID}`)
        .set('authorization', token)
        .send({ text: 'hi there', tags: ['b216117b-d684-4875-96ff-8c42636e3f4d'] })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.text).to.equal('hi there');
          expect(res.body.tags).to.be.an('array');
          expect(res.body.tags).to.have.lengthOf(1);
          expect(res.body.tags[0].name).to.equal('programming');
          done();
        });
    });
    it('should update a note by id and then be able to find it', function (done) {
      chai.request(server)
        .put(`${ROOT_URL}/${KNOWN_ID}`)
        .set('authorization', token)
        .send({ text: 'hi there' })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          chai.request(server)
            .get(`${ROOT_URL}/${KNOWN_ID}`)
            .set('authorization', token)
            .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res).to.be.json;
              expect(res.body).to.be.an('object');
              expect(res.body.text).to.equal('hi there');
              done();
            });
        });
    });
  });

  describe('delete', function () {
    beforeEach('login', function () {
      return login();
    });

    it('should delete a note by id', function (done) {
      chai.request(server)
        .delete(`${ROOT_URL}/${KNOWN_ID}`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should delete a note by id and then not find it', function (done) {
      chai.request(server)
        .delete(`${ROOT_URL}/${KNOWN_ID}`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          chai.request(server)
            .get(`${ROOT_URL}/${KNOWN_ID}`)
            .set('authorization', token)
            .end(function (err, res) {
              expect(res).to.have.status(404);
              done();
            });
        });
    });

    it('should fail deleting a note by invalid id', function (done) {
      chai.request(server)
        .delete(`${ROOT_URL}/${UNKNOWN_ID}`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  describe('tagsByNote', function () {
    beforeEach('login', function () {
      return login();
    });

    it('should retrieve tags by a note id', function (done) {
      chai.request(server)
        .get(`${ROOT_URL}/${KNOWN_ID}/tags`)
        .set('authorization', token)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0].name).to.equal('leisure');
          done();
        });
    });
  });
});
