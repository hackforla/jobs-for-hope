const express = require("express");
const { pool } = require("../../services/postgres-pool");
const { passport } = require("../../services/passport");
const bcrypt = require("bcrypt-nodejs");
const uuid = require("uuid/v4");
const { transporter, resetOptions } = require("../../services/nodemailer");

const router = express.Router();

// AUTH CHECK:

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    const sql = `select organization_id from users_to_orgs where user_id = ${
      req.user.id
    }`;
    pool.query(sql).then(data => {
      const formattedData = data.rows.map(row => row.organization_id);
      res.json({
        id: req.user.id,
        email: req.user.email,
        organization: formattedData,
        role: req.user.role
      });
    });
  } else {
    res.json({ organization: [0] });
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
  const lowerEmail = email.toLowerCase();

  if (organization) {
    //select or insert organization
    const sqlGetOrg =
      typeof organization === "string"
        ? `select id, name from organizations where name='${organization}'`
        : `insert into organizations (name, url, logo, email, phone, is_user_created) 
                values ('${organization.orgName}', '${
            organization.website
          }', 'codeforamerica.svg', '${organization.contactEmail}', '${
            organization.contactPhone
          }', 'true') returning *`;
    pool.query(sqlGetOrg).then(data => {
      //register employer
      const organization_id = data.rows[0].id;
      const first_org = data.rows[0].name;
      const sqlInsertEmployer = `insert into login (email, hash, first_org) 
        values ('${lowerEmail}', '${bcrypt.hashSync(
        password
      )}', '${first_org}') returning id`;
      pool.query(sqlInsertEmployer).then(user => {
        //insert user into users_to_orgs table
        const userObj = user.rows[0];
        const sqlUsersToOrg = `insert into users_to_orgs (user_id, organization_id)
            values ('${userObj.id}', '${organization_id}')`;
        pool.query(sqlUsersToOrg).then(data => {
          req.login(userObj, err => {
            if (err) {
              return next(err);
            }
            return res.json("success");
          });
        });
      });
    });
  } else {
    // register and login job seeker
    const sqlInsertJobSeeker = `insert into login (email, hash, role) values ('${lowerEmail}', '${bcrypt.hashSync(
      password
    )}', 'jobSeeker') returning id`;
    pool.query(sqlInsertJobSeeker).then(user => {
      const userObj = user.rows[0];
      req.login(userObj, err => {
        if (err) {
          return next(err);
        }
        return res.json("success");
      });
    });
  }
  // });
});

// PASSWORD RESET:

router.post("/send-reset", (req, res) => {
  const { email } = req.body;
  const lowerEmail = email.toLowerCase();
  const sql = `select * from login where email = '${lowerEmail}'`;
  pool.query(sql).then(data => {
    if (!data.rows[0])
      return res.json(
        "Could not complete request. Please check the email you have entered and try again."
      );
    const delSQL = `delete from resets where email = '${lowerEmail}'`;
    pool.query(delSQL).then(delInfo => {
      const resetToken = uuid();
      const sql2 = `insert into resets (email, reset_token)
                      values ('${lowerEmail}', '${resetToken}')`;
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

router.post("/submit-reset", (req, res) => {
  const { token, password } = req.body;
  const delSQL = `DELETE FROM resets WHERE timestamp < now()-'1 hour'::interval`;
  pool.query(delSQL).then(delInfo => {
    const sql = `select * from resets where reset_token = '${token}'`;
    pool.query(sql).then(data => {
      const user = data.rows[0];
      if (user) {
        const sql2 = `update login
          set hash = '${bcrypt.hashSync(password)}'
          where email = '${user.email.toLowerCase()}';`;
        pool.query(sql2).then(data => {
          res.json("success");
        });
      } else {
        res.json("Error: no data for user. Your link may have expired.");
      }
    });
  });
});

// LOGOUT:

router.get("/logout", function(req, res) {
  req.logout();
  res.json("success");
});

module.exports = router;
