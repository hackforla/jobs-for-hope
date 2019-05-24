const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
      select o.id, o.name, o.url, o.logo, o.mission, o.description,
        o.street, o.suite, o.city, o.state, o.zip, o.latitude, o.longitude, 
        o.phone, o.email,
        count(j.organization_id) as job_count
      from organizations o
      left join jobs j on o.id = j.organization_id
      group by o.id, o.name, o.url, o.logo, o.mission, o.description,
        o.street, o.suite, o.city, o.state, o.zip, o.latitude, o.longitude,
        o.phone, o.email
      order by o.name
    `;
  return pool.query(sql).then(res => {
    const organizations = [];
    res.rows.forEach(row => {
      organizations.push(row);
    });
    // unfortunately, pg doesn't support multiple result sets, so
    // we have to hit the server a second  time to get region organizations.
    return getAllOrganizationRegions(orgRegionResult => {
      orgRegionResult.rows.forEach(orgRegion => {
        const parentOrg = organizations.find(
          org => org.id == orgRegion.organization_id
        );
        if (parentOrg.regions) {
          parentOrg.regions.push(orgRegion);
        } else {
          parentOrg.regions = [orgRegion];
        }
        return organizations;
      });
    });
  });
};

const getAllOrganizationRegions = () => {
  const sql = `
      select o.id, r.id, r.name,
      from organizations o 
        join organization_regions ors on o.id = ors.organization_id
        join regions r on ors.region_id = r.id
    `;
  return pool.query(sql).then(res => {
    const organizationRegions = [];
    res.rows.forEach(row => {
      organizationRegions.push(row);
    });
    return organizationRegions;
  });
};

const get = id => {
  const sql = `
      select o.id, o.name, o.url, o.logo, o.mission, o.description,
        o.street, o.suite, o.city, o.state, o.zip, o.latitude, o.longitude, 
        o.phone, o.email,
        count(j.organization_id) as job_count
      from organizations o
      left join jobs j on o.id = j.organization_id
      where o.id = $1
      group by o.id, o.name, o.url, o.logo, o.mission, o.description,
        o.street, o.suite, o.city, o.state, o.zip, o.latitude, o.longitude,
        o.phone, o.email
    `;
  const values = [id];
  return pool.query(sql, values).then(res => {
    const organizations = [];
    res.rows.forEach(row => {
      organizations.push(row);
    });
    if (organizations.length > 0) {
      return organizations[0];
    }
    return null;
  });
};

const post = org => {
  const sql = `
    INSERT INTO organizations(name, url, logo, mission, description, 
      street, suite, city, state, zip, latitude, longitude,
      phone, email) 
    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
    RETURNING id
    `;
  const values = [
    org.name,
    org.url,
    org.logo,
    org.mission,
    org.description,
    org.street,
    org.suite,
    org.city,
    org.state,
    org.zip,
    org.latitude,
    org.longitude,
    org.phone,
    org.email
  ];

  return pool.query(sql, values).then(response => {
    return response.rows[0];
  });
};

const put = org => {
  const sql = `
    UPDATE organizations SET 
      name = $1, 
      url = $2, 
      logo = $3,
      mission = $4,
      description = $5,
      street = $6,
      suite = $7,
      city = $8,
      state = $9,
      zip = $10,
      latitude = $11,
      longitude = $12,
      phone = $13,
      email = $14
    WHERE id = $15
    `;
  const values = [
    org.name,
    org.url,
    org.logo,
    org.mission,
    org.description,
    org.street,
    org.suite,
    org.city,
    org.state,
    org.zip,
    org.latitude,
    org.longitude,
    org.phone,
    org.email,
    org.id
  ];

  return pool.query(sql, values);
};

const del = id => {
  const sql = "DELETE FROM organizations WHERE id = $1";
  const values = [id];

  return pool.query(sql, values);
};

const updateFileKey = (id, fileKey) => {
  const sql = `
    UPDATE organizations SET 
      logo = $1
    WHERE id = $2
    `;
  const values = [fileKey, id];

  return pool.query(sql, values);
};

module.exports = {
  getAll,
  get,
  post,
  put,
  del,
  updateFileKey
};
