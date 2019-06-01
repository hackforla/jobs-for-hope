const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
      select r.id, r.name
      from regions r
      order by r.name
    `;
  return pool.query(sql).then(res => {
    const regions = [];
    res.rows.forEach(row => {
      regions.push(row);
    });
    return regions;
  });
};

module.exports = {
  getAll
};
