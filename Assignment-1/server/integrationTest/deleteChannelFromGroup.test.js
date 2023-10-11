const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('deleteChannelFromGroup Route', () => {
  it('should delete a channel from a group', (done) => {
    const channelId = 'Channel1'; // Replace with an existing channel ID in your database
    const groupId = 1; // Replace with an existing group ID in your database

    chai.request(app)
      .delete(`/deleteChannelFromGroup/${channelId}/${groupId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('message').equal('Channel removed from group.');
        done();
      });
  });

  it('should return an error for an invalid group', (done) => {
    const channelId = 'Channel1'; // Replace with an existing channel ID in your database
    const groupId = 999; // Replace with a non-existing group ID

    chai.request(app)
      .delete(`/deleteChannelFromGroup/${channelId}/${groupId}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Group not found.');
        done();
      });
  });

  it('should return an error for an invalid channel', (done) => {
    const channelId = 'NonExistentChannel'; // Replace with a non-existing channel ID
    const groupId = 1; // Replace with an existing group ID in your database

    chai.request(app)
      .delete(`/deleteChannelFromGroup/${channelId}/${groupId}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(false);
        res.body.should.have.property('message').equal('Channel not found in the group.');
        done();
      });
  });
});
