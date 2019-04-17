const { Pool } = require("pg");

const pool = new Pool({
  user: 'jobsforhope',
  host: 'jobsforhope.cwzzfusjsll6.us-west-2.rds.amazonaws.com',
  database: 'jobsforhope',
  password: 'Dogfood1!',
  port: '5432'
});

module.exports = {
  pool
};
