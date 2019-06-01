const postgresService = require("../../services/region_service");
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  postgresService
    .getAll()
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.status("404").json({ error: err.toString() });
    });
});

module.exports = router;
