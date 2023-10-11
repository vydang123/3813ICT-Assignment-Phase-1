const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('deleteGroup Route', () => {
  it('should delete an existing group', (done) => {
    const groupName = 'Red'; // Replace with an existing group name in your database

    chai.request(app)
      .delete(`/api/deleteGroup/${groupName}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message').equal(`Group ${groupName} deleted successfully.`);
        done();
      });
  });

  it('should return an error for a non-existing group', (done) => {
    const groupName = 'NonExistentGroup'; // Replace with a non-existing group name

    chai.request(app)
      .delete(`/api/deleteGroup/${groupName}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('message').equal(`Group ${groupName} not found.`);
        done();
      });
  });
});
