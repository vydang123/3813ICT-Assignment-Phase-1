module.exports = async (db, app, client) => {
  app.post('/removeUserFromGroup', async (req, res) => {
      const username = req.body.username; // Change the parameter to 'username'
      const groupname = req.body.groupname; // Change the parameter to 'groupname'

      if (!username || !groupname) {
          return res.status(400).send({ success: false, message: 'username and groupname are required.' });
      }

      // Connect to the MongoDB client
      await client.connect();

      const groupCollection = db.collection('group-channel');
      const userCollection = db.collection('users');

      try {
          // Check if the group exists
          const group = await groupCollection.findOne({ groupname: groupname });
          if (!group) {
              return res.status(400).send({ success: false, message: 'Group not found.' });
          }

          // Find the user by username
          const user = await userCollection.findOne({ username: username });
          if (!user) {
              return res.status(400).send({ success: false, message: 'User not found.' });
          }

          // Remove userId from group members
          if (group.members && group.members.includes(user.userid)) {
              group.members = group.members.filter(memberId => memberId !== user.userid);

              // Update the group in the database
              await groupCollection.updateOne({ groupname: groupname }, { $set: group });
          }

          // Remove groupname from user's groupnames array
          if (user.groupnames && user.groupnames.includes(group.groupname)) {
              user.groupnames = user.groupnames.filter(groupName => groupName !== group.groupname);

              // Update the user in the database
              await userCollection.updateOne({ username: username }, { $set: user });
          }

          res.send({ success: true, message: 'User removed from group.' });
      } catch (error) {
          console.error('Error removing user from group:', error);
          return res.status(500).send({ success: false, message: 'Server error.' });
      } finally {
          // Close the MongoDB client connection
          await client.close();
      }
  });
};
