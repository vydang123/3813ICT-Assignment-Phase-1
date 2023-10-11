module.exports = function (db, app, client) {
    app.get('/user/groups', async function (req, res) {
      await client.connect();
  
      const userId = req.query.userId; // You may need to pass the user's ID in the request.
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      try {
        // Fetch the user's groups from the database based on the user's ID.
        const user = await db.collection('users').findOne({ userid: userId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        res.json({ groupnames: user.groupnames });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  
      client.close();
    });
  
    app.get('/group/:groupname/channels', async function (req, res) {
      await client.connect();
  
      const groupname = req.params.groupname;
  
      if (!groupname) {
        return res.status(400).json({ error: 'Group name is required' });
      }
  
      try {
        // Fetch the channels for the selected group from the database.
        const group = await db.collection('group-channel').findOne({ groupname: groupname });
        if (!group) {
          return res.status(404).json({ error: 'Group not found' });
        }
  
        res.json({ channels: group.channels });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  
      client.close();
    });
  };
  