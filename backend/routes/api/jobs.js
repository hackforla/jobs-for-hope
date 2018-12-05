const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', (req, res) => {
  const url = "https://spreadsheets.google.com/feeds/list/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/od6/public/values?alt=json";
  fetch(url)
    .then(data => data.json())
    .then(jobs => res.json(jobs.feed.entry))
    .catch(err => res.status('404').json({ "error": "Error loading jobs" }));
});

module.exports = router;
