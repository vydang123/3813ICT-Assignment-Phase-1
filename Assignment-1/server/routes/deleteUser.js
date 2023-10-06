module.exports = (client) => {
    return async (req, res) => {
      const userId = req.params.userId;
  
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const userCollection = db.collection('users'); // Replace 'users' with your actual collection name
  
        const deletedUser = await userCollection.findOneAndDelete({ userid: userId });
  
        if (!deletedUser.value) {
          return res.status(404).send({ success: false, message: 'User not found.' });
        }
  
        return res.send({ success: true, message: 'User deleted successfully.' });
      } catch (err) {
        console.error('Error in deleteUser:', err);
        return res.status(500).send({ success: false, message: 'Server error.' });
      }
    };
  };
  