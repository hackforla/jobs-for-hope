const express = require("express");
const { pool } = require("../../services/postgres-pool");
const { passport } = require("../../services/passport");
const bcrypt = require("bcrypt-nodejs");
const uuid = require("uuid/v4");
const {
  transporter,
  confirmOptions,
  resetOptions
} = require("../../services/nodemailer");

const router = express.Router();
const clientUrl = process.env.CLIENT_URL;

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
    const sql2 = `select id from organizations where name='${organization}'`;
    pool.query(sql2).then(data => {
      const id = data.rows[0].id;
      const sql3 = `insert into emails_to_orgs (email, organization, organization_id) 
                values ('${email}', '${organization}', '${id}')`;
      pool.query(sql3).then(stuff => {
        const sql4 = `insert into login (email, organization, hash, id) 
                values ('${email}', '${organization}', 
                '${bcrypt.hashSync(password)}', '${uuid()}')
                returning id`;
        pool.query(sql4).then(user => {
          const userObj = user.rows[0];
          req.login(userObj, err => {
            if (err) {
              return next(err);
            }
            return res.json("success");
          });
        });
      });
    });
  });
});

router.post("/register/new-org", (req, res, next) => {
  const {
    orgName,
    website,
    contactEmail,
    contactPhone,
    email,
    password,
    confirm
  } = req.body;
  const sql = `select * from login where email = '${email}'`;
  // make a transaction
  pool.query(sql).then(data => {
    if (data.rows[0]) return res.json("User already exists");

    const sql2 = `insert into organizations (name, url, logo, email, phone, is_user_created) 
                values ('${orgName}', '${website}', 'codeforamerica.svg', '${contactEmail}', '${contactPhone}', 'true') returning id`;
    pool.query(sql2).then(data => {
      const id = data.rows[0].id;
      const sql3 = `insert into emails_to_orgs (email, organization, organization_id) 
                values ('${email}', '${orgName}', '${id}')`;
      pool.query(sql3).then(data => {
        const sql4 = `insert into login (email, organization, hash, id) 
                values ('${email}', '${orgName}', 
                '${bcrypt.hashSync(password)}', '${uuid()}')
                returning id`;
        pool.query(sql4).then(user => {
          const userObj = user.rows[0];
          req.login(userObj, err => {
            if (err) {
              return next(err);
            }
            return res.json("success");
          });
        });
      });
    });
  });
});

// EMAIL CONFIRMATION:

router.post("/send-confirm", (req, res) => {
  const { email } = req.body;
  const sql = `select * from login where email = '${email}'`;
  pool.query(sql).then(data => {
    if (data.rows[0]) return res.json("User already exists");
    const confirmId = uuid();
    const finalOptions = confirmOptions(email, confirmId);
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
        res.redirect(clientUrl);
      });
    } else {
      res.json("Error: no data for user");
    }
  });
});

// PASSWORD RESET:

router.post("/send-reset", (req, res) => {
  const { email } = req.body;
  const sql = `select * from login where email = '${email}'`;
  pool.query(sql).then(data => {
    if (!data.rows[0])
      return res.json(
        "Could not complete request. Please check the email you have entered and try again."
      );

    const delSQL = `delete from resets where email = '${email}'`;
    pool.query(delSQL).then(delInfo => {
      const resetToken = uuid();
      const sql2 = `insert into resets (email, reset_token) 
                      values ('${email}', '${resetToken}')`;
      pool.query(sql2).then(info => {
        const finalOptions = resetOptions(email, resetToken);
        transporter.sendMail(finalOptions, function(err, result) {
          if (err) {
            res.json(`There was an error. Please try again.`);
          } else {
            res.json(`success`);
          }
        });
      });
    });
  });
});

router.get("/reset/:token", (req, res) => {
  const { token } = req.params;
  const delSQL = `DELETE FROM resets WHERE timestamp < now()-'1 hour'::interval`;
  pool.query(delSQL).then(delInfo => {
    const sql = `select * from resets where reset_token = '${token}'`;
    pool.query(sql).then(data => {
      const user = data.rows[0];
      if (user) {
        const sql2 = `select id from login where email = '${user.email}'`;
        pool.query(sql2).then(data => {
          const userid = data.rows[0].id;
          res.redirect(`${clientUrl}reset/${userid}`);
        });
      } else {
        res.redirect(`${clientUrl}error/404`);
      }
    });
  });
});

router.post("/submit-reset", (req, res) => {
  const { userid, password } = req.body;
  const sql = `update login
    set hash = '${bcrypt.hashSync(password)}' 
    where id = '${userid}';`;
  pool.query(sql).then(data => {
    res.json("success");
  });
});

// LOGOUT:

router.get("/logout", function(req, res) {
  req.logout();
  res.json("success");
});

module.exports = router;
