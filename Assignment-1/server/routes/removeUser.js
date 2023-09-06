var fs = require('fs');

module.exports = (req, res) => {
    const userId = Number(req.params.userId);
    const groupId = Number(req.params.groupId);

    // Read from users.json
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error reading the file." });
        }

        let users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.userid === userId);

        if(userIndex === -1) {
            return res.status(400).send({ message: "User not found." });
        }

        // Remove groupId from user's groupids array
        const groupIndex = users[userIndex].groupids.indexOf(groupId);
        if (groupIndex > -1) {
            users[userIndex].groupids.splice(groupIndex, 1);
        }

        // Write the updated user list back to users.json
        fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).send({ message: "Error writing to the file." });
            }
            res.send({ message: "User removed from group successfully." });
        });
    });
};
