const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('addUserToChannel Route', () => {
  it('should add a user to a channel within a group', (done) => {
    const requestData = {
      username: 'uuuu', // Replace with an existing username in your database
      groupname: 'Red', // Replace with an existing groupname in your database
      channelname: 'Channel1', // Replace with an existing channelname in your database
    };

    chai.request(app)
      .post('/addUserToChannel')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('message').equal('User added to the channel within the group.');
        done();
      });
  });

  it('should return an error for missing data', (done) => {
    // Missing required fields intentionally
    const requestData = {
      // Missing username, groupname, and channelname intentionally
    };

    chai.request(app)
      .post('/addUserToChannel')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Username, groupname, and channelname are required.');
        done();
      });
  });

  it('should return an error for an invalid user', (done) => {
    const requestData = {
      username: 'nonexistent_user', // Replace with a non-existing username
      groupname: 'Red', // Replace with an existing groupname in your database
      channelname: 'Channel1', // Replace with an existing channelname in your database
    };

    chai.request(app)
      .post('/addUserToChannel')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('User not found.');
        done();
      });
  });

  it('should return an error for an invalid group', (done) => {
    const requestData = {
      username: 'uuuu', // Replace with an existing username in your database
      groupname: 'nonexistent_group', // Replace with a non-existing groupname
      channelname: 'Channel1', // Replace with an existing channelname in your database
    };

    chai.request(app)
      .post('/addUserToChannel')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Group not found.');
        done();
      });
  });

  it('should return an error for an invalid channel', (done) => {
    const requestData = {
      username: 'uuuu', // Replace with an existing username in your database
      groupname: 'Red', // Replace with an existing groupname in your database
      channelname: 'nonexistent_channel', // Replace with a non-existing channelname
    };

    chai.request(app)
      .post('/addUserToChannel')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Channel not found in the group.');
        done();
      });
  });
});
