module.exports = (client) => {
    return async (req, res) => {
      const newGroup = req.body;
  
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const groupCollection = db.collection('group-channel'); // Replace 'group-channel.json' with your actual collection name
  
        // Find the count of documents in the collection to determine the new group's ID
        const groupsCount = await groupCollection.countDocuments();
        newGroup.groupid = groupsCount + 1;
  
        // Insert the new group into the collection
        const insertedGroup = await groupCollection.insertOne(newGroup);
  
        if (!insertedGroup.insertedId) {
          return res.status(500).send("Error creating group.");
        }
  
        return res.send({ message: "Group created successfully." });
      } catch (err) {
        console.error('Error in createGroup:', err);
        return res.status(500).send("Server error.");
      }
    };
  };
  