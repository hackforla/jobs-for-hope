const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
    select date as scrape_date, j.job_title, j.job_summary, j.job_location, j.job_zip_code, 
    j.job_post_date, j.full_or_part, j.salary, j.info_link,  j.organization_id, j.is_user_created, j.id,
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
        id: row.id,
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

const getJob = id => {
  const sql = `select * from jobs where id = ${id}`;
  return pool.query(sql).then(res => {
    return res.rows[0];
  });
};

const postJob = req => {
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
    return res;
  });
};

const editJob = (req, id) => {
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
  const sql = `update jobs
               set organization_id = '${+organization}', 
                   job_title = '${title}', 
                   job_summary = '${description}',
                   job_location = '${location}',
                   job_post_date = '${postDate}',
                   full_or_part = '${hours}',
                   salary = '${salaryLow + " - " + salaryHigh}',
                   info_link = '${url}',
                   job_zip_code = '${zip}',
                   is_user_created = 'true'
                where id = ${id}`;
  return pool.query(sql).then(res => {
    return res;
  });
};

const deleteJob = id => {
  const sql = `delete from jobs where id = ${id}`;
  return pool.query(sql).then(res => {
    return res;
  });
};

module.exports = {
  getAll,
  getJob,
  postJob,
  editJob,
  deleteJob
};
