var fs = require('fs');

module.exports = (req, res) => {
    const userId = req.params.userId;
    
    // Read from users.json
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error reading the file." });
        }

        let users = JSON.parse(data);
        
        // Filter out the user with the given userId
        const updatedUsers = users.filter(user => user.userid.toString() !== userId);

        // Write the updated user list back to users.json
        fs.writeFile('./data/users.json', JSON.stringify(updatedUsers, null, 2), err => {
            if (err) {
                return res.status(500).send({ message: "Error writing to the file." });
            }
            res.send({ message: "User deleted successfully." });
        });
    });
};
