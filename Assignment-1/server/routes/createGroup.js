var fs = require('fs');

module.exports = (req, res) => {
    const newGroup = req.body;
    fs.readFile('./data/group-channel.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading the file.");
        }
        const groups = JSON.parse(data);
        newGroup.groupid = groups.length + 1;
        groups.push(newGroup);
        fs.writeFile('./data/group-channel.json', JSON.stringify(groups, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send("Error writing to the file.");
            }
            res.send({ message: "Group created successfully." });
        });
    });
};
