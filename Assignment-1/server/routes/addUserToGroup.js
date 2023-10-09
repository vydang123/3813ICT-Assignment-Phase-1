module.exports = (db, app, client) => {
  app.put('/addUserToGroup', async (req, res) => {
      const username = req.body.username;
      const groupname = req.body.groupname;

      if (!username || !groupname) {
          return res.status(400).send({ success: false, message: 'Username and groupname are required.' });
      }

      try {
          // Add client.connect to establish a connection to the MongoDB server
          await client.connect();

          const groupCollection = db.collection('group-channel');
          const userCollection = db.collection('users');

          const group = await groupCollection.findOne({ groupname: groupname });

          if (!group) {
              return res.status(400).send({ success: false, message: 'Group not found.' });
          }

          if (!Array.isArray(group.members)) {
              group.members = [];
          }

          const user = await userCollection.findOne({ username: username });

          if (user) {
              if (!Array.isArray(user.groupnames)) {
                  user.groupnames = [];
              }
              if (!user.groupnames.includes(groupname)) {
                  user.groupnames.push(groupname);
              }

              await userCollection.updateOne({ username: username }, { $set: { groupnames: user.groupnames } });
          }

          if (!group.members.includes(username)) {
              group.members.push(username);
          }

          await groupCollection.updateOne({ groupname: groupname }, { $set: { members: group.members } });

          res.send({ success: true, message: 'User added to group.' });
      } catch (error) {
          console.error('Error adding user to group:', error);
          return res.status(500).send({ success: false, message: 'Server error.' });
      } finally {
          // Close the connection when done
          await client.close();
      }
  });
};
