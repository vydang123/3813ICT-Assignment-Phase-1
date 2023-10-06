module.exports = (client) => {
    return async (req, res) => {
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const userCollection = db.collection('users'); // Replace 'users' with your actual collection name
  
        const users = await userCollection.find({}).toArray();
  
        res.send(users);
      } catch (err) {
        console.error('Error in getUser:', err);
        return res.status(500).send({ message: "Server error." });
      }
    };
  };
  