module.exports = (db, app, client) => {
  app.post('/createGroup', async (req, res) => {
    try {
      await client.connect();

      const newGroup = req.body;

      const db = client.db('assignment'); // Replace with your actual database name
      const groupCollection = db.collection('group-channel'); // Replace 'group-channel' with your actual collection name

      // Find the count of documents in the collection to determine the new group's ID
      const groupsCount = await groupCollection.countDocuments();
      newGroup.groupid = groupsCount + 1;

      // Insert the new group into the collection
      const insertedGroup = await groupCollection.insertOne(newGroup);

      if (!insertedGroup.insertedId) {
        return res.status(500).send({ success: false, message: 'Error creating group.' });
      }

      res.send({ success: true, message: 'Group created successfully.' });
    } catch (err) {
      console.error('Error in createGroup:', err);
      return res.status(500).send({ success: false, message: 'Server error.' });
    } finally {
      client.close();
    }
  });
};
