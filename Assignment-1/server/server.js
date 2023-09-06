const express = require('express');
const app = express();
const http = require('http');
var cors = require('cors')
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '/../dist/week4tut')));

console.log(__dirname);
// Setup http server with express app
const server = http.createServer(app);

// Use the setupSockets function from sockets.js
const { setupSockets } = require('./sockets');
setupSockets(server);


const users = []; // Example empty array. In a real application, this could be a database call.




server.listen(3000, "localhost", function() {
    var d = new Date();
    var n = d.getHours();
    var m = d.getMinutes();

    console.log(`Server has been started at: ${n}:${m}`);
});
// Use the authRouter for handling authentication routes
app.post('/login', require('./routes/postLogin'));
app.post('/register',require('./routes/postRegister'));
