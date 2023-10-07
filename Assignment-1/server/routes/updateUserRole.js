module.exports = function (db, app, client) {
  app.post('/updateUserRole', async (req, res) => {
    await client.connect();

    try {
      const { userId, newRole } = req.body;

      // Assuming you have a 'users' collection in your MongoDB
      const userCollection = db.collection('users');

      // Find user by userId and update the role
      const updatedUser = await userCollection.findOneAndUpdate(
        { userid: userId },
        { $set: { role: newRole } },
        { returnOriginal: false }
      );

      if (updatedUser.value) {
        return res.send({ message: 'User role updated successfully.' });
      } else {
        return res.status(404).send({ message: 'User not found.' });
      }
    } catch (err) {
      console.error('Error in updateUserRole:', err);
      return res.status(500).send({ message: 'Error updating user role.' });
    } finally {
      client.close();
    }
  });
};
