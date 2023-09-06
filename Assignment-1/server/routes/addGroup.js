const fs = require('fs');

module.exports = (req, res) => {
    // Logic to add the new group to your database or JSON file

    // Sample logic: 
    fs.readFile('./data/group-channel.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error reading the file." });
        }
        let groups = JSON.parse(data);
        groups.push(req.body);
        fs.writeFile('./data/group-channel.json', JSON.stringify(groups), err => {
            if (err) {
                return res.status(500).send({ message: "Error writing to the file." });
            }
            res.send({ success: true, message: 'Group added successfully.' });
        });
    });
};
