module.exports = function (db, app, client) {
  app.post('/register', async function (req, res) {
    // Connect to the MongoDB client
    await client.connect();

    if (!req.body) {
      return res.sendStatus(400);
    }

    const newUser = req.body;
    const action = req.body.action;

    try {
      const userCollection = db.collection('users'); // Replace 'users' with your actual collection name
      
      //activate action 'listUser' in super-admin page
      if (action === 'listUser') {
        const users = await userCollection.find().toArray();
        console.log(users);
        return res.send({ users: users });
      }

      // Check if email already exists
      const existingUser = await userCollection.findOne({ email: newUser.email });
      if (existingUser) {
        return res.status(400).send({ valid: false, message: 'Email already in use.' });
      }

      // Check if username already exists
      const existingUsername = await userCollection.findOne({ username: newUser.username });
      if (existingUsername) {
        return res.status(400).send({ valid: false, message: 'Username already exists. Choose another.' });
      }

      // Assign new userID
      const usersCount = await userCollection.countDocuments();
      newUser.userid = usersCount + 1;

      // Add new user to the MongoDB collection
      await userCollection.insertOne(newUser);

      return res.send({ valid: true });
    } catch (err) {
      console.error('Error in postRegister:', err);
      return res.status(500).send({ valid: false, message: 'Error in registration.' });
    } finally {
      client.close();
    }
  });
};
