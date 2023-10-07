module.exports = (db, app, client) => {
  app.delete('/removeUser/:userId/:groupId', async (req, res) => {
    const userId = Number(req.params.userId);
    const groupId = Number(req.params.groupId);

    try {
      await client.connect();

      const db = client.db('assignment'); // Replace with your actual database name

      const userCollection = db.collection('users'); // Replace 'users' with your actual collection name

      const user = await userCollection.findOne({ userid: userId });

      if (!user) {
        return res.status(400).send({ message: "User not found." });
      }

      const groupIds = user.groupids.filter(id => id !== groupId);

      await userCollection.updateOne({ userid: userId }, { $set: { groupids: groupIds } });

      return res.send({ message: "User removed from group successfully." });
    } catch (err) {
      console.error('Error in removeUser:', err);
      return res.status(500).send({ message: "Server error." });
    } finally {
      client.close();
    }
  });
};
