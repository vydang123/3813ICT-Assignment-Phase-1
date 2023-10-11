const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('removeUser Route', () => {
  it('should remove a user from a group', (done) => {
    const groupname = 'TestGroup'; // Replace with an existing group name
    const username = 'TestUser'; // Replace with an existing username

    chai.request(app)
      .post('/removeUserFromGroup')
      .send({ groupname, username })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('message').equal('User removed from group.');
        done();
      });
  });

  it('should return an error for missing groupname', (done) => {
    const username = 'TestUser'; // Replace with an existing username

    chai.request(app)
      .post('/removeUserFromGroup')
      .send({ username })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Groupname and username are required.');
        done();
      });
  });

  it('should return an error for missing username', (done) => {
    const groupname = 'TestGroup'; // Replace with an existing group name

    chai.request(app)
      .post('/removeUserFromGroup')
      .send({ groupname })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Groupname and username are required.');
        done();
      });
  });

  it('should return an error if the group does not exist', (done) => {
    const groupname = 'NonExistentGroup'; // Replace with a non-existent group name
    const username = 'TestUser'; // Replace with an existing username

    chai.request(app)
      .post('/removeUserFromGroup')
      .send({ groupname, username })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Group not found.');
        done();
      });
  });

  it('should return an error if the user does not exist', (done) => {
    const groupname = 'TestGroup'; // Replace with an existing group name
    const username = 'NonExistentUser'; // Replace with a non-existent username

    chai.request(app)
      .post('/removeUserFromGroup')
      .send({ groupname, username })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('User not found.');
        done();
      });
  });
});
