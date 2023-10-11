const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('getUsers Route', () => {
  it('should retrieve all users from the database', (done) => {
    chai.request(app)
      .get('/getUsers')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        // Add more assertions as needed based on the structure of your data
        done();
      });
  });
});
