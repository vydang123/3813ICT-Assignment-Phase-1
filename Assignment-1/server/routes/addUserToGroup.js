const fs = require('fs');

module.exports = (req, res) => {
    const userId = Number(req.body.userId);
    const groupId = Number(req.body.groupId);
    console.log(userId, groupId)
    if (!userId || !groupId) {
        return res.status(400).send({ success: false, message: 'userId and groupId are required.' });
    }

    const groupFilePath = './data/group-channel.json';
    const userFilePath = './data/users.json';

    // Update group-channel.json
    fs.readFile(groupFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the group-channel file', err);
            return res.status(500).send({ success: false, message: 'Server error.' });
        }

        let groups = JSON.parse(data);
        const groupIndex = groups.findIndex(group => group.groupid === groupId);

        if (groupIndex === -1) {
            return res.status(400).send({ success: false, message: 'Group not found.' });
        }

        if (!Array.isArray(groups[groupIndex].members)) {
            groups[groupIndex].members = [];
        }

        if (groups[groupIndex].members.includes(userId)) {
            return res.status(400).send({ success: false, message: 'User already in the group.' });
        }

        groups[groupIndex].members.push(userId);

        // Update users.json
        fs.readFile(userFilePath, 'utf8', (err, userData) => {
            if (err) {
                console.error('Error reading the users file', err);
                return res.status(500).send({ success: false, message: 'Server error.' });
            }

            let users = JSON.parse(userData);
            const userIndex = users.findIndex(user => user.userid === userId);

            if (userIndex !== -1) {
                users[userIndex].groupid = groupId;
            }

            // Write updates to both files
            fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Error writing to the group-channel file', err);
                    return res.status(500).send({ success: false, message: 'Server error.' });
                }

                fs.writeFile(userFilePath, JSON.stringify(users, null, 2), 'utf8', err => {
                    if (err) {
                        console.error('Error writing to the users file', err);
                        return res.status(500).send({ success: false, message: 'Server error.' });
                    }

                    res.send({ success: true, message: 'User added to group.' });
                });
            });
        });
    });
};
