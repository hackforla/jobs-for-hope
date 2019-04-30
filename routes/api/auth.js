const express = require("express");
const { pool } = require("../../services/postgres-pool");
const { passport } = require("../../services/passport");
const bcrypt = require("bcrypt-nodejs");
const uuid = require("uuid/v4");
const { transporter, mailOptions } = require("../../services/nodemailer");

const router = express.Router();

// AUTH CHECK:

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

// LOGIN:

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

// REGISTER:

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

// EMAIL CONFIRMATION:

router.post("/send-confirm", (req, res, next) => {
  const { email } = req.body;
  const sql = `select * from login where email = '${email}'`;
  pool.query(sql).then(data => {
    if (data.rows[0]) return res.json("User already exists");
    const confirmId = uuid();
    const finalOptions = mailOptions(email, confirmId);
    const sql2 = `delete from confirm where email = '${email}'`;
    pool.query(sql2).then(delInfo => {
      const sql3 = `insert into confirm (email, id) 
                      values ('${email}', '${confirmId}') 
                      returning email`;
      pool.query(sql3).then(user => {
        transporter.sendMail(finalOptions, function(err, result) {
          if (err) {
            res.json(`there was an error: ${err}`);
          } else {
            res.json(`here is the res:  ${result}`);
          }
        });
      });
    });
  });
});

router.get("/confirm/:id", (req, res) => {
  const { id } = req.params;
  const sql = `select * from confirm where id = '${id}'`;
  pool.query(sql).then(data => {
    const user = data.rows[0];
    if (user) {
      const sql2 = `update login
                      set confirmed = 'true' 
                      where email = '${user.email}'`;
      pool.query(sql2).then(stuff => {
        res.redirect("http://localhost:3000/");
      });
    } else {
      res.json("Error: no data for user");
    }
  });
});

// LOGOUT:

router.get("/logout", function(req, res) {
  req.logout();
  res.json("success");
});

module.exports = router;
