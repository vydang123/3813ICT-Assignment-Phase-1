const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('deleteUser Route', () => {
  it('should delete an existing user by email', (done) => {
    const userEmail = 'abc@gmail.com'; // Replace with an existing user's email in your database

    chai.request(app)
      .delete(`/deleteUser/${userEmail}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message').equal('User deleted successfully.');
        done();
      });
  });

  it('should return an error for a non-existing user', (done) => {
    const userEmail = 'nonexistent@example.com'; // Replace with a non-existing email

    chai.request(app)
      .delete(`/deleteUser/${userEmail}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('message').equal('User not found.');
        done();
      });
  });

  it('should return an error for missing email', (done) => {
    chai.request(app)
      .delete('/deleteUser/')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message').equal('Email is required.');
        done();
      });
  });
});
