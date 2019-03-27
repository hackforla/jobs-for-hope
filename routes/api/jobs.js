const sqliteService = require("../../services/job_service_sqlite");
const postgresService = require("../../services/job_service");
const express = require("express");

const router = express.Router();

const db = process.env.DATABASE;
const svc = db === "sqlite" ? sqliteService : postgresService;

router.get("/", (req, res) => {
  svc
    .getAll()
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.status("404").json({ error: err.toString() });
    });
});

router.get("/scrape", (req, res) => {
  const { spawn } = require("child_process");
  const pyProg = spawn("python", ["./jfh_scraper.py"]);

  pyProg.stdout.on("data", function(data) {
    res.write(data);
    res.end("end");
  });
});

module.exports = router;
