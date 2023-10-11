module.exports = function (db, app, client) {
  app.get('/getUsers', async (req, res) => {
    

    try {
      // Connect to the MongoDB client
      await client.connect();
      // Assuming you have a 'users' collection in your MongoDB
      const userCollection = db.collection('users');

      // Retrieve all users from the 'users' collection
      const users = await userCollection.find().toArray();

      //send all data to reponse page
        res.send(users);
      
      
    } catch (err) {
      console.error('Error in getUsers:', err);
      return res.status(500).send({ message: 'Error retrieving users.' });
    } finally {
      client.close();
    }
  });
};
