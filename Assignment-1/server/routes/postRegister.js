var fs = require('fs');

module.exports = (req, res) => {
    // Get user data from request body
    const newUser = req.body;
    const action = req.body.action;
    // Read users from JSON
    const users = readusers();

    // If there's an error reading users, return a server error response
    if (!users) {
        return res.status(500).send({ valid: false, message: 'Error reading users.' });
    }

    if (action === "listUser") {
      console.log(users)
        return res.send({users: users});
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
        return res.status(400).send({ valid: false, message: 'Email already in use.' });
    }
  
     // Check if username already exists
     if (users.some(user => user.username === newUser.username)) {
      return res.status(400).send({ valid: false, message: 'Username already exists. Choose another.' });
  }

    // Assign new userID
    newUser.userid = users.length + 1;
    
    // Add new user to users array
    users.push(newUser);
  
    // Write updated users back to users.json
    fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', err => {
        if(err) {
            return res.status(500).send({ valid: false, message: 'Error writing to file.' });
        }
        return res.send({ valid: true });
    });
};

function readusers() {
    try {
        var data = fs.readFileSync('./data/users.json', 'utf8');
        return JSON.parse(data);
    } catch(err) {
        console.error('Error reading users:', err);
        return null;
    }
}
