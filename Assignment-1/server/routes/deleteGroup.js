// deleteGroup.js

module.exports = async (db, app, client) => {
  app.delete('/api/deleteGroup/:groupName', async (req, res) => {
    try {
      // Connect to the MongoDB client
      await client.connect();

      const groupName = req.params.groupName;
      const result = await db.collection('group-channel').deleteOne({ groupname: groupName });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: `Group ${groupName} deleted successfully.` });
      } else {
        res.status(404).json({ message: `Group ${groupName} not found.` });
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({ message: "An error occurred while deleting the group." });
    } finally {
      // Close the MongoDB client connection
      await client.close();
    }
  });
};
