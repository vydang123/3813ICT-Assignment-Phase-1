module.exports = (db, app, client) => {
  app.post('/addGroup', async (req, res) => {
    try {
      // Connect to MongoDB
      await client.connect();

      if (!req.body) {
        return res.sendStatus(400);
      }

      const groupCollection = db.collection('group-channel'); // Replace 'group-channel' with your actual collection name

      //insert a new group to the collection
      const insertedGroup = await groupCollection.insertOne(req.body);

      if (!insertedGroup.insertedId) {
        return res.status(500).send({ success: false, message: 'Error creating group.' });
      }

      res.send({ success: true, message: 'Group added successfully.' });
    } catch (err) {
      console.error('Error in addGroup:', err);
      return res.status(500).send({ success: false, message: 'Server error.' });
    } finally {
      client.close();
    }
  });
};
