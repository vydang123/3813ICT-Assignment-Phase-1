module.exports = async (db, app, client) => {
    app.delete('/deleteUser/:email', async (req, res) => {
        if (!req.params.email) {
            return res.status(400).send({ message: "Email is required." });
        }

        const email = req.params.email;

        try {
            // Connect to MongoDB
            await client.connect();

            // Find and delete the user by email
            const result = await db.collection('users').deleteOne({ email });

            if (result.deletedCount === 1) {
                return res.send({ message: "User deleted successfully." });
            } else {
                return res.status(404).send({ message: "User not found." });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).send({ message: "Error deleting user." });
        } finally {
            // Close the MongoDB client after the operation
            client.close();
        }
    });
};
