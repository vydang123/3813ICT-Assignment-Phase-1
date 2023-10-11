const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
// Setup http server with express app
const server = http.createServer(app);

// Use the setupSockets function from sockets.js
const { setupSockets } = require('./sockets');
setupSockets(server);


const PORT = 3000;

const bodyParser = require('body-parser');
const path = require('path');

const dbName = 'assignment';

const {MongoClient} = require('mongodb'),
client = new MongoClient('mongodb://127.0.0.1:27017/');

const db = client.db(dbName);
// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../dist/week4tut')));

  // Define your REST API routes
  require('./routes/postLogin.js')(db, app, client);
  require('./routes/addChannel.js')(db, app, client);
  require('./routes/addGroup.js')(db, app, client);
  require('./routes/addUserToGroup.js')(db, app, client);
  require('./routes/addUserToChannel.js')(db, app, client);
  require('./routes/createGroup.js')(db, app, client);
  require('./routes/deleteChannelFromGroup.js')(db, app, client);
  require('./routes/deleteGroup.js')(db, app, client);
  require('./routes/deleteUser.js')(db, app, client);
  require('./routes/getGroups.js')(db, app, client);
  require('./routes/getUsers.js')(db, app, client);
  require('./routes/postRegister.js')(db, app, client);
  require('./routes/removeUser.js')(db, app, client);
  require('./routes/updateUserRole.js')(db, app, client);
 

// Start the server listening on the specified port
server.listen(PORT, "localhost", function() {
  var d = new Date();
  var n = d.getHours();
  var m = d.getMinutes();

  console.log(`Server has been started at: ${n}:${m}`);
});


module.exports = app;