const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('postLogin Route', () => {
  it('should authenticate and return user data for valid credentials', (done) => {
    const validUser = {
      email: 'abc@gmail.com', // Replace with a valid user's email
      pwd: '123', // Replace with the correct password for the user
    };

    chai.request(app)
      .post('/login')
      .send(validUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('valid').equal(true);
        res.body.should.have.property('user');
        // Add more assertions as needed based on the user data structure
        done();
      });
  });

  it('should return invalid for invalid credentials', (done) => {
    const invalidUser = {
      email: 'invalid@example.com', // Replace with an invalid email
      pwd: 'invalidpassword', // Replace with an incorrect password
    };

    chai.request(app)
      .post('/login')
      .send(invalidUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('valid').equal(false);
        done();
      });
  });

  it('should return an error for missing credentials', (done) => {
    chai.request(app)
      .post('/login')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
