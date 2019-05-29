const express = require("express");
const { pool } = require("../../services/postgres-pool");
const { passport } = require("../../services/passport");
const { transporter, confirmOptions } = require("../../services/nodemailer");
const uuid = require("uuid/v4");

const router = express.Router();
const clientUrl = process.env.CLIENT_URL;

// ADMIN VERIFICATION:

router.get("/", (req, res) => {
	const sql = `select email, first_org from login where role = 'pending'`;
	pool.query(sql).then(result => {
		res.json(result);
	});
});

router.post("/approve", (req, res) => {
	const { email } = req.body;
	const sql = `update login set role = 'employer' where email = '${email}'`;
	pool.query(sql).then(result => res.json(email));
});

router.post("/reject", (req, res) => {});

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

module.exports = router;
