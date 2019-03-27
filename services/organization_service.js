const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
      select o.id, o.name, o.url, o.logo, count(j.organization_id) as job_count
      from organizations o
      left join jobs j on o.id = j.organization_id
      group by o.id, o.name, o.url, o.logo
    `;
  return pool.query(sql).then(res => {
    const organizations = [];
    res.rows.forEach(row => {
      organizations.push({
        id: row.id,
        name: row.name,
        url: row.url,
        logo: row.logo,
        job_count: row.job_count
      });
    });
    return organizations;
  });
};

module.exports = {
  getAll
};
