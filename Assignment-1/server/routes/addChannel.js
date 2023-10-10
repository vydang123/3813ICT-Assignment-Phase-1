module.exports = async (db, app, client) => {
  app.post('/addChannel', async (req, res) => {
      try {
          await client.connect();

          if (!req.body) {
              return res.status(400).send({ success: false, message: 'Request body is empty.' });
          }

          const groupName = req.body.groupName;
          const groupId = Number(req.body.groupId);

          if (!groupName || !groupId) {
              return res.status(400).send({ success: false, message: 'groupName and groupId are required.' });
          }

          const groupCollection = db.collection('group-channel');

          const existingGroup = await groupCollection.findOne({ groupid: groupId });

          if (!existingGroup) {
              return res.status(400).send({ success: false, message: 'Group not found.' });
          }

          const channels = existingGroup.channels || [];
          channels.push(groupName);

          const updateResult = await groupCollection.updateOne(
              { groupid: groupId },
              { $set: { channels: channels } }
          );

          if (updateResult.modifiedCount === 0) {
              return res.status(500).send({ success: false, message: 'Error adding channel to group.' });
          }

          res.send({ success: true, message: 'Channel added to group.' });
      } catch (err) {
          console.error('Error in addChannel:', err);
          return res.status(500).send({ success: false, message: 'Server error.' });
      } finally {
          client.close();
      }
  });
};
