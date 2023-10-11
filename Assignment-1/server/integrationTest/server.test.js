const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming your Express app is exported from server.js

chai.use(chaiHttp);
chai.should();

describe('Server', () => {
  it('should return "Server has been started" message', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.include('Server has been started');
        done();
      });
  });

  it('should handle a 404 error for an unknown route', (done) => {
    chai.request(app)
      .get('/nonexistent')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  // Add more test cases for your routes and API endpoints here
});
