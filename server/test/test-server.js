const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../server');

chai.use(chaiHttp);
const expect = chai.expect;

/* Mocha prefers not using arrow functions */
/* eslint prefer-arrow-callback: 0 */

describe('Server', function () {
  it('should handle unknown route', function (done) {
    chai.request(server)
      .get('/xxxxxx')
      .end(function (err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });
});

describe('General Api', function () {
  it('should get some data on /ping GET', function (done) {
    chai.request(server)
      .get('/ping')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.text).to.be.a('string');
        done();
      });
  });
});
