module.exports = (db, app, client) => {
  app.delete('/deleteChannelFromGroup/:channelId/:groupId', async (req, res) => {
    try {
      await client.connect();

      const channelId = req.params.channelId;
      const groupId = Number(req.params.groupId);

      
      const groupCollection = db.collection('group-channel'); // Replace 'group-channel' with your actual collection name

      //find a group
      const group = await groupCollection.findOne({ groupid: groupId });

      if (!group) {
        return res.status(400).send({ success: false, message: 'Group not found.' });
      }

      const updatedChannels = group.channels.filter(channel => channel !== channelId);

      //find a channel and delete channel
      await groupCollection.updateOne({ groupid: groupId }, { $set: { channels: updatedChannels } });

      res.send({ success: true, message: 'Channel removed from group.' });
    } catch (err) {
      console.error('Error in deleteChannelFromGroup:', err);
      return res.status(500).send({ success: false, message: 'Server error.' });
    } finally {
      client.close();
    }
  });
};
