module.exports = (db, app, client) => {
  app.get('/getGroups', async (req, res) => {
    try {
      await client.connect();

      const db = client.db('assignment'); // Replace with your actual database name

      const groupCollection = db.collection('group-channel'); // Replace 'group-channel' with your actual collection name

      const groups = await groupCollection.find({}).toArray();

      res.send(groups);
    } catch (err) {
      console.error('Error in getGroups:', err);
      return res.status(500).send({ message: "Server error." });
    } finally {
      client.close();
    }
  });
};
