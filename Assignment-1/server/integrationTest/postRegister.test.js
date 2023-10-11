const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('postRegister Route', () => {
  it('should register a new user', (done) => {
    const newUser = {
      // Replace with valid user data
      username: 'newUser',
      email: 'newuser@example.com',
      password: 'newPassword',
    };

    chai.request(app)
      .post('/register')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('valid').equal(true);
        done();
      });
  });

  it('should return an error if email already exists', (done) => {
    const existingUser = {
      // Use an email that already exists in your database
      username: 'existingUser',
      email: 'existinguser@example.com',
      password: 'existingPassword',
    };

    chai.request(app)
      .post('/register')
      .send(existingUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('valid').equal(false);
        res.body.should.have.property('message').equal('Email already in use.');
        done();
      });
  });

  it('should return an error if username already exists', (done) => {
    const existingUsername = {
      // Use a username that already exists in your database
      username: 'existingUser',
      email: 'newuser@example.com',
      password: 'newPassword',
    };

    chai.request(app)
      .post('/register')
      .send(existingUsername)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('valid').equal(false);
        res.body.should.have.property('message').equal('Username already exists. Choose another.');
        done();
      });
  });

  it('should return an error for missing data', (done) => {
    chai.request(app)
      .post('/register')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
