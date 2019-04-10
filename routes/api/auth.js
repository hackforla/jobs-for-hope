const express = require("express");
const { pool } = require("../../services/postgres-pool");
const { passport } = require("../../services/passport");
const bcrypt = require('bcrypt-nodejs');

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(info) {return res.send(info.message)}
    if (err) { return next(err); }
    if (!user) { return res.json('Invalid Credentials'); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.json('success');
    })
  })(req, res, next);
})

router.post('/register', (req, res, next) => {
  const { email, password } = req.body;
  const sql = `select * from login where email = '${email}'`
  // make a transaction
  pool.query(sql)
    .then(data => {
      console.log(data);
      if (data.rows[0]) return res.json('User already exists');
      const sql2 = `insert into login (email, hash, id) 
                values ('${email}', '${bcrypt.hashSync(password)}', '${uuid()}')
                returning *`
      pool.query(sql2).
        then(user => {
          const userObj = user.rows[0];
          req.login(userObj, (err) => {
            if (err) { return next(err); }
            return res.json('success');
          })
        })
    })
});

router.get('/authrequired', (req, res) => {
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    res.redirect('/')
  }
})

module.exports = router;
