const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('createGroup Route', () => {
  it('should create a new group', (done) => {
    const requestData = {
      groupname: 'NewGroup', // Replace with a group name that doesn't exist in your database
      channels: ['Channel1', 'Channel2'], // Replace with channel names
      members: [1, 2, 3], // Replace with user IDs
    };

    chai.request(app)
      .post('/createGroup')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('message').equal('Group created successfully.');
        done();
      });
  });

  it('should return an error for duplicate group name', (done) => {
    // Use an existing group name from your database to simulate a duplicate name
    const requestData = {
      groupname: 'Red', // Replace with an existing group name in your database
      channels: ['Channel1', 'Channel2'],
      members: [1, 2, 3],
    };

    chai.request(app)
      .post('/createGroup')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Error creating group.');
        done();
      });
  });

  it('should return an error for missing data', (done) => {
    // Missing required fields intentionally
    const requestData = {
      // Missing groupname, channels, and members intentionally
    };

    chai.request(app)
      .post('/createGroup')
      .send(requestData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Error creating group.');
        done();
      });
  });
});
