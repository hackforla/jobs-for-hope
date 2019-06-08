const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
      select r.id, r.name, r.spa, r.code, r.display_order
      from regions r
      order by r.display_order, r.name
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
