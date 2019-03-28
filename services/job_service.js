const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
    select date as scrape_date, j.job_title, j.job_summary, j.job_location, j.job_zip_code, 
    j.job_post_date, j.full_or_part, j.salary, j.info_link,  j.organization_id, 
    o.name as organization_name, o.logo as organization_logo 
    from jobs j
    left join organizations o on j.organization_id = o.id
    order by o.name, j.job_title
  `;
  return pool.query(sql).then(res => {
    const jobs = [];
    res.rows.forEach(row => {
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
    return jobs;
  });
};

module.exports = {
  getAll
};
