module.exports = (client) => {
    return async (req, res) => {
      const groupName = req.body.groupName;
      const groupId = Number(req.body.groupId);
  
      if (!groupName || !groupId) {
        return res.status(400).send({ success: false, message: 'groupName and groupId are required.' });
      }
  
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const groupCollection = db.collection('group-channel'); // Replace 'groups' with your actual collection name
  
        const updatedGroup = await groupCollection.findOneAndUpdate(
          { groupId: groupId },
          { $push: { channels: groupName } }
        );
  
        if (!updatedGroup.value) {
          return res.status(400).send({ success: false, message: 'Group not found.' });
        }
  
        return res.send({ success: true, message: 'Channel added to group.' });
      } catch (err) {
        console.error('Error in addChannel:', err);
        return res.status(500).send({ success: false, message: 'Server error.' });
      }
    };
  };
  