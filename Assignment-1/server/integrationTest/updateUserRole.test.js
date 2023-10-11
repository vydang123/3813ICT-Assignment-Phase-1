const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('updateUserRole Route', () => {
  it('should update the user role', (done) => {
    const userToUpdateRole = {
      userId: '1', // Replace with the ID of an existing user in your database
      newRole: 'newRole', // Replace with the new role you want to assign
    };

    chai.request(app)
      .put('/updateUserRole')
      .send(userToUpdateRole)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message').equal('User role updated successfully.');
        done();
      });
  });

  it('should return an error if the user does not exist', (done) => {
    const invalidUserToUpdateRole = {
      userId: '999', // Use a non-existent user ID
      newRole: 'newRole',
    };

    chai.request(app)
      .put('/updateUserRole')
      .send(invalidUserToUpdateRole)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('message').equal('User not found.');
        done();
      });
  });

  it('should return an error for missing data', (done) => {
    chai.request(app)
      .put('/updateUserRole')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});
