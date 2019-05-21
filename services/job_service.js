const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
    select date as scrape_date, j.job_title, j.job_summary, j.job_location, j.job_zip_code, 
    j.job_post_date, j.full_or_part, j.salary, j.info_link,  j.organization_id, j.is_user_created, 
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
        info_link: row.info_link,
        is_user_created: row.is_user_created
      });
    });
    return jobs;
  });
};

const postJob = req => {
  console.log("BEFORE SQL QUERY", req);
  const {
    organization,
    title,
    description,
    location,
    postDate,
    hours,
    salaryLow,
    salaryHigh,
    url,
    zip
  } = req;
  const sql = `insert into jobs (organization_id, 
                                 job_title, 
                                 job_summary,
                                 job_location,
                                 job_post_date,
                                 full_or_part,
                                 salary,
                                 info_link,
                                 job_zip_code,
                                 is_user_created
                                 ) values ('${+organization}',
                                           '${title}',
                                           '${description}',
                                           '${location}',
                                           '${postDate}',
                                           '${hours}',
                                           '${salaryLow + " - " + salaryHigh}',
                                           '${url}',
                                           '${zip}',
                                           'true')`;
  return pool.query(sql).then(res => {
    console.log("AFTER SQL QUERY", res);
    return res;
  });
};

module.exports = {
  getAll,
  postJob
};
