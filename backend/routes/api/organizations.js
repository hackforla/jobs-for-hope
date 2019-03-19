const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database('jobs_for_hope.db')
  const organizations = []
  const sql = `
    select o.id, o.name, o.url, o.logo, count(j.organization_id) as job_count
    from organizations o
    left join jobs j on o.id = j.organization_id
    group by o.id, o.name, o.url, o.logo
  `
  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err)
      db.close()
      res.status('404').json({ 'error': 'Error loading jobs' })
    }
    rows.forEach(row => {
      organizations.push({
        id: row.id,
        name: row.name,
        url: row.url,
        logo: row.logo,
        job_count: row.job_count
      })
    })
    res.send(organizations)
  })
  db.close()
})

// Used to keep org data in a google sheet
// router.get('/', (req, res) => {
//   const url = 'https://spreadsheets.google.com/feeds/list/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/3/public/values?alt=json'
//   fetch(url)
//     .then(data => data.json())
//     .then(orgs => res.json(orgs.feed.entry))
//     .catch(err => {
//       console.error(err)
//       res.status('404').json({ 'error': 'Error loading orgs' })
//     })
// })

module.exports = router
