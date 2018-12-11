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

// @route   GET api/jobs/all
// @desc    Get all jobs v2
// @access  Public
router.get('/all/', (req, res) => {
  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database('jobs_for_hope.db')
  jobs = []
  db.all('SELECT * from jobs', (err, rows) => {
    if(err) {
      console.error(err)
      db.close()
      res.status('404').json({'error': 'Error loading jobs'})
    }
    rows.forEach(row => {
      jobs.push({
        date: row.date,
        org: row.org,
        title: row.job_title,
        location: row.job_location,
        post_date: row.job_post_date,
        hours: row.full_or_part,
        salary: row.salary,
        info_link: row.info_link,
        zipcode: '',
        responsibilities: ''})
    });
    res.send(jobs)
  });
  db.close()
})

module.exports = router
