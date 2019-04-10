const { Pool } = require("pg");

const pool = new Pool({
  user: 'blynn',
  host: 'localhost',
  password: 'cookies',
  database: 'jobs-for-hope',
  port: '5432'
});

module.exports = {
  pool
};
