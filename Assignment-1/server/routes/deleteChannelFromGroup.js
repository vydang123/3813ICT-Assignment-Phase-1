module.exports = (client) => {
    return async (req, res) => {
      const channelId = req.params.channelId;
      const groupId = Number(req.params.groupId);
  
      try {
        const db = client.db('assignment'); // Replace with your actual database name
  
        const groupCollection = db.collection('group-channel'); // Replace 'group-channel.json' with your actual collection name
  
        const group = await groupCollection.findOne({ groupid: groupId });
  
        if (!group) {
          return res.status(400).send({ success: false, message: 'Group not found.' });
        }
  
        const updatedChannels = group.channels.filter(channel => channel !== channelId);
  
        await groupCollection.updateOne({ groupid: groupId }, { $set: { channels: updatedChannels } });
  
        return res.send({ success: true, message: 'Channel removed from group.' });
      } catch (err) {
        console.error('Error in deleteChannelFromGroup:', err);
        return res.status(500).send({ success: false, message: 'Server error.' });
      }
    };
  };
  