const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('addChannel Route', () => {
  it('should add a channel to a group', (done) => {
    const channelData = {
      groupName: 'NewChannelName',
      groupId: 1, // Replace with a valid group ID from your database
    };

    chai.request(app)
      .post('/addChannel')
      .send(channelData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('message').equal('Channel added to group.');
        done();
      });
  });

  it('should return an error for invalid data', (done) => {
    const invalidData = {
      // Missing groupName and groupId intentionally
    };

    chai.request(app)
      .post('/addChannel')
      .send(invalidData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('groupName and groupId are required.');
        done();
      });
  });

  it('should return an error if the group does not exist', (done) => {
    const nonExistentGroup = {
      groupName: 'NewChannelName',
      groupId: 999, // Assuming this group ID does not exist in your database
    };

    chai.request(app)
      .post('/addChannel')
      .send(nonExistentGroup)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Group not found.');
        done();
      });
  });
});
