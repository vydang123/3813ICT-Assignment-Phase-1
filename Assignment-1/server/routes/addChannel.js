const fs = require('fs');

module.exports = (req, res) => {
    const groupName = req.body.groupName;
    const groupId = Number(req.body.groupId);
    
    if (!groupName || !groupId) {
        return res.status(400).send({ success: false, message: 'groupName and groupId are required.' });
    }

    const groupFilePath = './data/group-channel.json';

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

        if (!Array.isArray(groups[groupIndex].channels)) {
            groups[groupIndex].channels = [];
        }

        groups[groupIndex].channels.push(groupName);

        fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing to the group-channel file', err);
                return res.status(500).send({ success: false, message: 'Server error.' });
            }

            res.send({ success: true, message: 'Channel added to group.' });
        });
    });
};
