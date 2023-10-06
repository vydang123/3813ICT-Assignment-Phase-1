module.exports = (client) => {
    return async (req, res) => {
      const { userId, newRole } = req.body;
  
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const userCollection = db.collection('users'); // Replace 'users' with your actual collection name
  
        const user = await userCollection.findOne({ userid: userId });
  
        if (!user) {
          return res.status(404).send({ message: "User not found." });
        }
  
        await userCollection.updateOne({ userid: userId }, { $set: { role: newRole } });
  
        return res.send({ message: "User role updated successfully." });
      } catch (err) {
        console.error('Error in updateUserRole:', err);
        return res.status(500).send({ message: "Server error." });
      }
    };
  };
  