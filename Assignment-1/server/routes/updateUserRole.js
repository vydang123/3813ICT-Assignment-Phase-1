var fs = require('fs');

module.exports = (req, res) => {
    const { userId, newRole } = req.body;

    // Read users from users.json
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error reading the file." });
        }

        let users = JSON.parse(data);

        // Find user and update role
        const user = users.find(user => user.userid === userId);
        if (user) {
            user.role = newRole;

            // Write the updated user list back to users.json
            fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), err => {
                if (err) {
                    return res.status(500).send({ message: "Error writing to the file." });
                }
                res.send({ message: "User role updated successfully." });
            });
        } else {
            res.status(404).send({ message: "User not found." });
        }
    });
};
