module.exports = (client) => {
    return async function (req, res) {
      var u = req.body.email;
      var p = req.body.pwd;
  
      try {
        const db = client.db('assignment'); 
  
        const userCollection = db.collection('users'); 
  
        const user = await userCollection.findOne({ email: u, password: p });
  
        if (user) {
          res.send({
            valid: true,
            user: {
              userid: user.userid,
              username: user.username,
              role: user.role,
              groupids: user.groupids,
              email: user.email,
            },
          });
        } else {
          res.send({ valid: false });
        }
      } catch (err) {
        console.error('Error in postLogin:', err);
        res.status(500).send({ valid: false });
      }
    };
  };
  