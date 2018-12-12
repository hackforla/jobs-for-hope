const express = require('express')

const jobs = require('./routes/api/jobs')
const orgs = require('./routes/api/organizations')

const app = express()

// Use Routes
app.use('/api/jobs', jobs)
app.use('/api/orgs', orgs)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
