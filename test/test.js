// const should = require("should");
// const request = require("request");
// const expect = require("chai").expect;
// const baseUrl = "http://localhost";
// const util = require("util");
//
// describe('checking', function () {
//   it('login', function (done) {
//     request.get({
//         url: baseUrl
//       },
//       function (error, response, body) {
//         // var bodyObj = JSON.parse(body);
//         // expect(bodyObj.name).to.equal("Luke Skywalker");
//         // expect(bodyObj.hair_color).to.equal("blond");
//         expect(response.statusCode).to.equal(200);
//         console.log(body);
//         done();
//       });
//   });
// });
const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../server.js');
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
    return chai.request(app)
      .post('/login')
      .send({
        username: '1@gmail.com',
        password: '123'
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.user.username).to.equal('1@gmail.com');
        expect(res.body.user.password).to.equal('123');
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
        let last_item = res.body.out.pop();
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.out).to.be.an('Array');
        expect(last_item.email).to.equal(test_recipient);
        expect(last_item.amount).to.equal(test_amount);
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
