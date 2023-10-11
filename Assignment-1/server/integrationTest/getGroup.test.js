const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('getGroups Route', () => {
  it('should retrieve all groups from the database', (done) => {
    chai.request(app)
      .get('/getGroups')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        // Add more assertions as needed based on the structure of your data
        done();
      });
  });
});
