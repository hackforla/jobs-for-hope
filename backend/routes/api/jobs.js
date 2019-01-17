const express = require('express')
const router = express.Router()

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', (req, res) => {
  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database('jobs_for_hope.db')
  const jobs = []
  db.all('SELECT * from jobs', (err, rows) => {
    if (err) {
      console.error(err)
      db.close()
      res.status('404').json({ 'error': 'Error loading jobs' })
    }
    rows.forEach(row => {
      jobs.push({
        date: row.date,
        org: row.org,
        title: row.job_title,
        summary: row.job_summary,
        location: row.job_location,
        zipcode: row.job_zip_code,
        post_date: row.job_post_date,
        hours: row.full_or_part,
        salary: row.salary,
        info_link: row.info_link
      })
    })
    res.send(jobs)
  })
  db.close()
})

// @route   GET api/jobs/scrape
// @desc    Call the web scraper to update the database
// @access  Public
router.get('/scrape', (req, res) => {
  const { spawn } = require('child_process')
  const pyProg = spawn('python', ['./jfh_scraper.py'])

  pyProg.stdout.on('data', function (data) {
    res.write(data)
    res.end('end')
  })
})

module.exports = router
