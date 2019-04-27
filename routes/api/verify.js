const express = require("express");
const { pool } = require("../../services/postgres-pool");
const { passport } = require("../../services/passport");

const router = express.Router();

router.get("/", (req, res) => {
	const sql = `select email, organization from login where role = 'pending'`;
	pool.query(sql).then(result => res.json(result));
});

router.post("/approve", (req, res) => {
	const { email } = req.body;
	const sql = `update login set role = 'employer' where email = '${email}'`;
	pool.query(sql).then(result => res.json(email));
});

router.post("/reject", (req, res) => {});

module.exports = router;
