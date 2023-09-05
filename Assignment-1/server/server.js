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

server.listen(3000, "localhost", function() {
    var d = new Date();
    var n = d.getHours();
    var m = d.getMinutes();

    console.log(`Server has been started at: ${n}:${m}`);
});
// Use the authRouter for handling authentication routes
app.post('/login', require('./routes/postLogin'));
app.post('/register',require('./routes/postRegister'));

// Endpoint to update a user
app.put('/updateUser', (req, res) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ valid: false });
        }

        let users = JSON.parse(data);
        const userToUpdate = req.body;
        const userIndex = users.findIndex(u => u.userid === userToUpdate.userid);

        if (userIndex > -1) {
            users[userIndex] = userToUpdate;
            
            fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', err => {
                if(err) {
                    return res.status(500).send({ valid: false });
                }
                res.send({ valid: true });
            });
        } else {
            res.status(400).send({ valid: false, message: 'User not found.' });
        }
    });
});

app.get('/getUsers', (req, res) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ valid: false });
        }

        let users = JSON.parse(data);
        res.send(users);
    });
});

// Endpoint to delete a user
app.delete('/deleteUser/:userid', (req, res) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ valid: false });
        }

        let users = JSON.parse(data);
        const userIdToDelete = parseInt(req.params.userid, 10);
        const userIndex = users.findIndex(u => u.userid === userIdToDelete);

        if (userIndex > -1) {
            users.splice(userIndex, 1);
            
            fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', err => {
                if(err) {
                    return res.status(500).send({ valid: false });
                }
                res.send({ valid: true });
            });
        } else {
            res.status(400).send({ valid: false, message: 'User not found.' });
        }
    });
});

app.post('/register', (req, res) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ valid: false });
        }

        let users = JSON.parse(data);
        const newUser = req.body;

        // You might also want to handle checking for existing usernames here

        users.push(newUser);

        fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', err => {
            if(err) {
                return res.status(500).send({ valid: false });
            }
            res.send({ valid: true });
        });
    });
});