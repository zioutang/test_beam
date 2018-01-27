const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));

// const app = require('../server.js'); // local test
const app = `https://beam-test-123.herokuapp.com`;
describe('API endpoint', function () {
  this.timeout(5000); // How long to wait for a response (ms)

  it('get login', function () {
    return chai.request(app)
      .get('/login')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
  });

  it('post login', function () {
    let test_username = '1@gmail.com'; // using an existing account to test
    let test_password = '123';
    return chai.request(app)
      .post('/login')
      .send({
        username: test_username,
        password: test_password
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.user.username).to.equal(test_username);
        expect(res.body.user.password).to.equal(test_password);
      });
  });

  it('get data', function () {
    return chai.request(app)
      .get('/data')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.success).equal(true);
      });
  });


  it('send money', function () {
    let test_recipient = '5@gmail.com';
    let test_amount = 2;
    return chai.request(app)
      .post('/send')
      .send({
        recipient: test_recipient,
        amount: test_amount
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
      });
  });

  it('post register', function () {
    let test_username = '1@gmail.com'; // using an existing account to test
    let test_password = '123';
    return chai.request(app)
      .post('/register')
      .send({
        username: test_username,
        password: test_password
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(false);
        expect(res.body.error.code).to.equal(11000);
        expect(res.body.error.op.username).to.equal(test_username);
        expect(res.body.error.op.password).to.equal(test_password);
      });
  });
});
