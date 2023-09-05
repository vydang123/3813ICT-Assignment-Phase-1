var fs = require('fs');
// Assuming you're using Express.js
module.exports = (req, res) => {
    // Get user data from request body
    const newUser = req.body;
  
    // Read users.json
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
      if(err) {
        return res.status(500).send({ valid: false });
      }
      
      let users = JSON.parse(data);
  
      // Check if email already exists
      if(users.some(user => user.email === newUser.email)) {
        return res.status(400).send({ valid: false, message: 'Email already in use.' });
      }
  
      // Assign new userID
      newUser.userid = users.length + 1;
      
      // Add new user to users array
      users.push(newUser);
  
      // Write updated users back to users.json
      fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), 'utf8', err => {
        if(err) {
          return res.status(500).send({ valid: false });
        }
        res.send({ valid: true });
      });
    });
  };
  