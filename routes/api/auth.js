const express = require("express");
const { pool } = require("../../services/postgres-pool");
const { passport } = require("../../services/passport");
const bcrypt = require("bcrypt-nodejs");
const uuid = require("uuid/v4");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user.id,
      organization: req.user.organization,
      role: req.user.role
    });
  } else {
    res.json({});
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (info) {
      return res.send(info.message);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ message: "Invalid Credentials" });
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.json({ success: true });
    });
  })(req, res, next);
});

router.post("/register", (req, res, next) => {
  const { email, password, organization } = req.body;
  const sql = `select * from login where email = '${email}'`;
  // make a transaction
  pool.query(sql).then(data => {
    if (data.rows[0]) return res.json("User already exists");
    const sql2 = `insert into login (email, organization, hash, id) 
                values ('${email}', '${organization}', '${bcrypt.hashSync(
      password
    )}', '${uuid()}')
                returning id`;
    pool.query(sql2).then(user => {
      const userObj = user.rows[0];
      req.login(userObj, err => {
        if (err) {
          return next(err);
        }
        return res.json({ success: true });
      });
    });
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.json("success");
});

module.exports = router;
