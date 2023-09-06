const fs = require('fs');

module.exports = (req, res) => {
    const channelId = req.params.channelId;
    const groupId = Number(req.params.groupId);

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

        const channelIndex = groups[groupIndex].channels.indexOf(channelId);
        if (channelIndex > -1) {
            groups[groupIndex].channels.splice(channelIndex, 1);  // Remove the channel from the group
        }

        fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing to the group-channel file', err);
                return res.status(500).send({ success: false, message: 'Server error.' });
            }

            res.send({ success: true, message: 'Channel removed from group.' });
        });
    });
};
