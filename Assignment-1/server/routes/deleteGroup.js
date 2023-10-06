module.exports = (client) => {
  return async (req, res) => {
    const groupId = Number(req.params.groupId);

    try {
      const db = client.db('assignment'); // Replace with your actual database name

      const groupCollection = db.collection('group-channel'); // Replace 'group-channel.json' with your actual collection name

      const deletedGroup = await groupCollection.findOneAndDelete({ groupid: groupId });

      if (!deletedGroup.value) {
        return res.status(404).send({ success: false, message: 'Group not found.' });
      }

      return res.send({ success: true, message: 'Group deleted successfully.' });
    } catch (err) {
      console.error('Error in deleteGroup:', err);
      return res.status(500).send({ success: false, message: 'Server error.' });
    }
  };
};
