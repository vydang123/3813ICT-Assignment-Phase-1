module.exports = async (db, app, client) => {
  app.post('/addUserToGroup', async (req, res) => {
    console.log("aaa")
      const username = req.body.username; // Change the parameter to 'username'
      const groupname = req.body.groupname; // Change the parameter to 'groupname'

      if (!username || !groupname) {
        console.log("bbb")
          return res.status(400).send({ success: false, message: 'username and groupname are required.' });
      }

      // Connect to the MongoDB client
      await client.connect();

      const groupCollection = db.collection('group-channel');
      const userCollection = db.collection('users');

      try {
        console.log("ccc")


         // Find the user by username
         const user = await userCollection.findOne({ username: username });
         if (!user) {
           console.log("eee")
             return res.status(400).send({ success: false, message: 'User not found.' });
         }

          // Check if the group exists
          const group = await groupCollection.findOne({ groupname: groupname });
          if (!group) {
            console.log("ddd")
              return res.status(400).send({ success: false, message: 'Group not found.' });
          }

         

          // Add userId to group members
          if (!group.members) {
            console.log("fff")
              group.members = [];
          }
          group.members.push(user.userid);

          // Update the group in the database
          await groupCollection.updateOne({ groupname: groupname }, { $set: group });

          // Add groupname to user's groupnames array
          if (!user.groupnames) {
            console.log("ggg")
              user.groupnames = [];
          }
          user.groupnames.push(group.groupname);

          // Update the user in the database
          await userCollection.updateOne({ username: username }, { $set: user });

          res.send({ success: true, message: 'User added to group.' });
      } catch (error) {
          console.error('Error adding user to group:', error);
          return res.status(500).send({ success: false, message: 'Server error.' });
      } finally {
          // Close the MongoDB client connection
          await client.close();
      }
  });
};
