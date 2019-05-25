const sqliteService = require("../../services/job_service_sqlite");
const postgresService = require("../../services/job_service");
const express = require("express");
const { pool } = require("../../services/postgres-pool");

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

router.get("/job/:id", (req, res) => {
  const { id } = req.params;
  svc
    .getJob(id)
    .then(resp => {
      res.json(resp);
    })
    .catch(err => {
      res.status("404").json({ error: err.toString() });
    });
});

router.post("/add", (req, res) => {
  svc
    .postJob(req.body.jobInfo)
    .then(resp => {
      res.json(resp);
    })
    .catch(err => {
      res.status("404").json({ error: err.toString() });
    });
});

router.post("/edit", (req, res) => {
  svc
    .editJob(req.body.jobInfo, req.body.id)
    .then(resp => {
      res.json(resp);
    })
    .catch(err => {
      res.status("404").json({ error: err.toString() });
    });
});

router.post("/delete", (req, res) => {
  const { id } = req.body;
  svc
    .deleteJob(id)
    .then(resp => {
      res.json(resp);
    })
    .catch(err => {
      res.status("404").json({ error: err.toString() });
    });
});

module.exports = router;
