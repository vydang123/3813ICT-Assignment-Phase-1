const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('addGroup Route', () => {
  it('should add a group', (done) => {
    const groupData = {
      groupid: 2, // Replace with a unique group ID
      groupname: 'NewGroup',
      channels: [], // Initially an empty array of channels
      members: [],  // Initially an empty array of members
    };

    chai.request(app)
      .post('/addGroup')
      .send(groupData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('message').equal('Group added successfully.');
        done();
      });
  });

  it('should return an error for invalid data', (done) => {
    // Missing required fields intentionally
    const invalidData = {
      // Missing groupname, groupid, channels, members intentionally
    };

    chai.request(app)
      .post('/addGroup')
      .send(invalidData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Bad Request');
        done();
      });
  });
});
