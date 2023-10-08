const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);

const PORT = 3000;
const url = "mongodb://127.0.0.1:27017/";
const bodyParser = require('body-parser');
const path = require('path');

const server = require('./listen.js');

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
  require('./routes/createGroup.js')(db, app, client);
  require('./routes/deleteChannelFromGroup.js')(db, app, client);
  require('./routes/deleteGroup.js')(db, app, client);
  require('./routes/deleteUser.js')(db, app, client);
  require('./routes/getGroups.js')(db, app, client);
  require('./routes/getUsers.js')(db, app, client);
  require('./routes/postRegister.js')(db, app, client);
  require('./routes/removeUser.js')(db, app, client);
  require('./routes/updateUserRole.js')(db, app, client);
  require('./listen.js')(http,PORT);


  