module.exports = (db, app, client) => {
  app.get('/getGroups', async (req, res) => {
    try {
      // Connect to the MongoDB client
      await client.connect();

      const groupCollection = db.collection('group-channel'); // connect to collection 'group-channel'

      // Retrieve all groups from the 'group-channel' collection
      const groups = await groupCollection.find({}).toArray();

      //send all data to the response page
      res.send(groups);
    } catch (err) {
      console.error('Error in getGroups:', err);
      return res.status(500).send({ message: "Server error." });
    } finally {
      client.close();
    }
  });
};
