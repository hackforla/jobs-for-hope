const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

// @route   GET api/orgs
// @desc    Get all orgs
// @access  Public
router.get('/', (req, res) => {
  const url = 'https://spreadsheets.google.com/feeds/list/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/3/public/values?alt=json'
  fetch(url)
    .then(data => data.json())
    .then(orgs => res.json(orgs.feed.entry))
    .catch(err => {
      console.error(err)
      res.status('404').json({ 'error': 'Error loading orgs' })
    })
})

module.exports = router
