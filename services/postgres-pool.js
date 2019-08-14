const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  ssl: true
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle node-postgres client", err);
  //process.exit(-1)
});

module.exports = {
  pool
};
