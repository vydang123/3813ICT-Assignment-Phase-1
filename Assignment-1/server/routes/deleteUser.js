module.exports = function (db, app, client) {
  app.delete('/deleteUser/:userId', async (req, res) => {
    await client.connect();

    try {
      const userId = req.params.userId;

      // Assuming you have a 'users' collection in your MongoDB
      const userCollection = db.collection('users');

      // Convert userId to ObjectID (assuming your userId is an ObjectId)
      const userObjectId = new ObjectID(userId);

      // Delete the user by ObjectId
      const deleteResult = await userCollection.deleteOne({ _id: userObjectId });

      if (deleteResult.deletedCount === 1) {
        return res.send({ message: 'User deleted successfully.' });
      } else {
        return res.status(404).send({ message: 'User not found.' });
      }
    } catch (err) {
      console.error('Error in deleteUser:', err);
      return res.status(500).send({ message: 'Error deleting user.' });
    } finally {
      client.close();
    }
  });
};
