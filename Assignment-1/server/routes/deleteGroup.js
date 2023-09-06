const fs = require('fs');

module.exports = (req, res) => {
  const groupId = Number(req.params.groupId);
  
  const groupFilePath = './data/group-channel.json';
  fs.readFile(groupFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error reading file.' });
    }

    const groups = JSON.parse(data);
    const groupIndex = groups.findIndex(group => group.groupid === groupId);

    if (groupIndex === -1) {
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    groups.splice(groupIndex, 1);

    fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), err => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error writing to file.' });
      }

      res.status(200).json({ success: true, message: 'Group deleted successfully.' });
    });
  });
};
