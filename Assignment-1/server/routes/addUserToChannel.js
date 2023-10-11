module.exports = async (db, app, client) => {
    app.post('/addUserToChannel', async (req, res) => {
      const username = req.body.username;
      const groupname = req.body.groupname;
      const channelname = req.body.channelname;
  
      if (!username || !groupname || !channelname) {
        console.log("aaa")
        return res.status(400).send({ success: false, message: 'Username, groupname, and channelname are required.' });
      }
  
      await client.connect();
  
      const groupCollection = db.collection('group-channel');
      const userCollection = db.collection('users');
  
      try {
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            console.log("bbb")
          return res.status(400).send({ success: false, message: 'User not found.' });
        }
  
        const group = await groupCollection.findOne({ groupname: groupname });
        if (!group) {
            console.log("ccc")
          return res.status(400).send({ success: false, message: 'Group not found.' });
        }
  
        // Check if the channel exists within the group
        if (!group.channels || group.channels.indexOf(channelname) === -1) {
            console.log("ddd")
          return res.status(400).send({ success: false, message: 'Channel not found in the group.' });
        }
  
        // Add userId to group members of the channel
        if (!group.members) {
            console.log("eee")
          group.members = [];
        }
        group.members.push(user.userid);
  
        // Update the group in the database
        await groupCollection.updateOne({ groupname: groupname }, { $set: group });
  
        
        // Add channelname to user's channel names array
        if (!user.channelnames) {
            console.log("ggg")
          user.channelnames = [];
        }
        user.channelnames.push(channelname);
  
        // Update the user in the database
        await userCollection.updateOne({ username: username }, { $set: user });
  
        res.send({ success: true, message: 'User added to the channel within the group.' });
      } catch (error) {
        console.error('Error adding user to channel:', error);
        return res.status(500).send({ success: false, message: 'Server error.' });
      } finally {
        await client.close();
      }
    });
  };
  