const dbfilename = process.env.SQLITE_FILE || "jobs_for_hope.db"

const getAll = () => {
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database(dbfilename);
  const sql = `
    select date as scrape_date, j.job_title, j.job_summary, j.job_location, j.job_zip_code, 
    j.job_post_date, j.full_or_part, j.salary, j.info_link,  j.organization_id, 
    o.name as organization_name, o.logo as organization_logo 
    from jobs j
    left join organizations o on j.organization_id = o.id
    order by o.name, j.job_title
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        db.close();
        reject(new Error("Error loading organizations"));
      }
      const jobs = [];
      rows.forEach(row => {
        jobs.push({
          scrape_date: row.scrape_date,
          organization_id: row.organization_id,
          organization_name: row.organization_name,
          organization_logo: row.organization_logo,
          title: row.job_title,
          summary: row.job_summary,
          location: row.job_location,
          zipcode: row.job_zip_code,
          post_date: row.job_post_date,
          hours: row.full_or_part,
          salary: row.salary,
          info_link: row.info_link
        });
      });
      db.close();
      resolve(jobs);
    });
  });
};

module.exports = {
  getAll
};
