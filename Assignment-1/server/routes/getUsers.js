module.exports = function (db, app, client) {
  app.get('/getUsers', async (req, res) => {
    

    try {
      await client.connect();
      // Assuming you have a 'users' collection in your MongoDB
      const userCollection = db.collection('users');

      // Retrieve all users from the 'users' collection
      const users = await userCollection.find().toArray();

      
        res.send(users);
      
      
    } catch (err) {
      console.error('Error in getUsers:', err);
      res.status(500).send({ message: 'Error retrieving users.' });
    } finally {
      client.close();
    }
  });
};
