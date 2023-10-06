module.exports = (client) => {
    return async (req, res) => {
      // Logic to add the new group to your database or JSON file
  
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const groupCollection = db.collection('group-channel'); // Replace 'groups' with your actual collection name
  
        const insertedGroup = await groupCollection.insertOne(req.body);
  
        if (!insertedGroup.insertedId) {
          return res.status(500).send({ success: false, message: 'Error creating group.' });
        }
  
        return res.send({ success: true, message: 'Group added successfully.' });
      } catch (err) {
        console.error('Error in addGroup:', err);
        return res.status(500).send({ success: false, message: 'Server error.' });
      }
    };
  };
  