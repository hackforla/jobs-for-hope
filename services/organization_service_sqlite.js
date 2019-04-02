const dbfilename = process.env.SQLITE_FILE || "jobs_for_hope.db"

const getAll = () => {
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database(dbfilename);
  const organizations = [];
  const sql = `
      select o.id, o.name, o.url, o.logo, count(j.organization_id) as job_count
      from organizations o
      left join jobs j on o.id = j.organization_id
      group by o.id, o.name, o.url, o.logo
    `;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        db.close();
        reject(new Error("Error loading organizations"));
      }
      rows.forEach(row => {
        organizations.push({
          id: row.id,
          name: row.name,
          url: row.url,
          logo: row.logo,
          job_count: row.job_count
        });
      });
      db.close();
      resolve(organizations);
    });
  });
};

module.exports = {
  getAll
};
