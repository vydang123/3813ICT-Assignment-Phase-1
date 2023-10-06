module.exports = (client) => {
    return async (req, res) => {
      const userId = Number(req.body.userId);
      const groupId = Number(req.body.groupId);
  
      if (!userId || !groupId) {
        return res.status(400).send({ success: false, message: 'userId and groupId are required.' });
      }
  
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const groupCollection = db.collection('group-channel'); // Replace 'groups' with your actual collection name
        const userCollection = db.collection('users'); // Replace 'users' with your actual collection name
  
        const updatedGroup = await groupCollection.findOneAndUpdate(
          { groupId: groupId },
          { $push: { members: userId } }
        );
  
        if (!updatedGroup.value) {
          return res.status(400).send({ success: false, message: 'Group not found.' });
        }
  
        const updatedUser = await userCollection.findOneAndUpdate(
          { userId: userId },
          { $addToSet: { groupids: groupId } }
        );
  
        if (!updatedUser.value) {
          return res.status(400).send({ success: false, message: 'User not found.' });
        }
  
        return res.send({ success: true, message: 'User added to group.' });
      } catch (err) {
        console.error('Error in addUserToGroup:', err);
        return res.status(500).send({ success: false, message: 'Server error.' });
      }
    };
  };
  