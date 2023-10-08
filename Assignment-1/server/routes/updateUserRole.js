module.exports = async (db, app, client) => {
    app.put('/updateUserRole', async (req, res) => {
        const { userId, newRole } = req.body;

        try {
            await client.connect(); // Connect to MongoDB

            const usersCollection = db.collection('users');

            // Find user and update role
            const user = await usersCollection.findOne({ userid: userId });
            if (user) {
                // Update the user's role
                await usersCollection.updateOne({ _id: user._id }, { $set: { role: newRole } });

                res.send({ message: "User role updated successfully." });
            } else {
                res.status(404).send({ message: "User not found." });
            }
        } catch (err) {
            console.error("Error updating user role:", err);
            res.status(500).send({ message: "Error updating user role." });
        } finally {
            await client.close(); // Close MongoDB connection
        }
    });
};
