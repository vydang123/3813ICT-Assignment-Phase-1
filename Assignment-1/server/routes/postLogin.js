module.exports = function(db, app, client ) {
  app.post('/login', async function(req, res) {
      await client.connect();
      if (!req.body) {
          return res.sendStatus(400);
        }
      const u = req.body.email;
      const p = req.body.pwd;
      console.log(u,p);
      let user = await db.collection('users').findOne({ email: u, password: p })
      console.log(user);
          if (user) {
              res.send({
                  valid: true,
                  user: {
                      userid: user.userid,
                      username: user.username,
                      role: user.role,
                      groupnames: user.groupnames,
                      email: user.email,
                      channelnames: user.channelnames
                  }
              });
          } else {
              res.send({ valid: false });
          }

      client.close();

      
  });
};