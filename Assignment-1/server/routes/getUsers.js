const fs = require('fs');

module.exports = (req, res) => {
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error reading the file." });
        }
        res.send(JSON.parse(data));
    });
};

