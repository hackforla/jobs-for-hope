/* eslint no-unused-expressions: "off" */
const chai = require('chai')
const expect = chai.expect

chai.use(require('chai-http'))

const app = require('../server.js')

describe('API endpoint /jobs/all', function () {
  this.timeout(5000)

  before(function () {

  })

  after(function () {

  })

  // GET - List all jobs
  it('should return all jobs', function () {
    return chai.request(app)
      .get('/api/jobs/all')
      .then(function (res) {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('array')
        expect(res.body[0]).to.be.an('object')
        expect(res.body[0]).to.have.all.keys('date', 'org', 'title', 'summary', 'location', 'zipcode', 'post_date', 'hours', 'salary', 'info_link')
      })
  })
})
