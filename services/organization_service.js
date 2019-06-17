const { pool } = require("./postgres-pool");

const getAll = () => {
  const sql = `
      select o.id, o.name, o.url, o.logo, o.mission, o.description,
        o.street, o.suite, o.city, o.state, o.zip, o.latitude, o.longitude,
        o.phone, o.email, o.is_approved,
        count(j.organization_id) as job_count
      from organizations o
      left join jobs j on o.id = j.organization_id
      group by o.id, o.name, o.url, o.logo, o.mission, o.description,
        o.street, o.suite, o.city, o.state, o.zip, o.latitude, o.longitude,
        o.phone, o.email, o.is_approved
      order by o.name
    `;
  return pool.query(sql).then(res => {
    const organizations = [];
    res.rows.forEach(row => {
      organizations.push(row);
    });
    // unfortunately, pg doesn't support multiple result sets, so
    // we have to hit the server a second time to get organizations' regions.
    return getAllOrganizationRegions().then(orgRegions => {
      orgRegions.forEach(orgRegion => {
        const parentOrg = organizations.find(
          org => org.id == orgRegion.organization_id
        );
        if (parentOrg.regions) {
          parentOrg.regions.push(orgRegion);
        } else {
          parentOrg.regions = [orgRegion];
        }
      });
      return organizations;
    });
  });
};

const getAllOrganizationRegions = () => {
  const sql = `
      select ors.organization_id, r.id, r.name, r.code, r.display_order, r.spa
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
        o.phone, o.email, o.is_user_created, o.is_approved
        count(j.organization_id) as job_count
      from organizations o
      left join jobs j on o.id = j.organization_id
      where o.id = $1
      group by o.id, o.name, o.url, o.logo, o.mission, o.description,
        o.street, o.suite, o.city, o.state, o.zip, o.latitude, o.longitude,
        o.phone, o.email, o.is_user_created, o.is_approved
    `;
  const values = [id];
  return pool.query(sql, values).then(res => {
    const organizations = [];
    res.rows.forEach(row => {
      organizations.push(row);
    });
    if (organizations.length > 0) {
      return getOrganizationRegions(organizations[0].id).then(orgRegions => {
        orgRegions.forEach(orgRegion => {
          if (organizations[0].regions) {
            organizations[0].regions.push(orgRegion);
          } else {
            organizations[0].regions = [orgRegion];
          }
        });
        return organizations[0];
      });
    }
    return null;
  });
};

const getOrganizationRegions = organization_id => {
  const sql = `
      select ors.organization_id, r.id, r.name, r.code, r.display_order, r.spa
      from organizations o
        join organization_regions ors on o.id = ors.organization_id
        join regions r on ors.region_id = r.id
      where o.id = $1
    `;
  const values = [organization_id];
  return pool.query(sql, values).then(res => {
    const organizationRegions = [];
    res.rows.forEach(row => {
      organizationRegions.push(row);
    });
    return organizationRegions;
  });
};

const post = async org => {
  const client = await pool.connect();
  try {
    client.query("BEGIN TRANSACTION");
    const sql = `
      INSERT INTO organizations(name, url, mission, description,
        street, suite, city, state, zip, latitude, longitude,
        phone, email)
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
      `;
    const values = [
      org.name,
      org.url,
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

    const insertResponse = await pool.query(sql, values);
    const id = insertResponse.rows[0];

    if (org.regionids) {
      const insertRegionSql =
        "INSERT INTO organization_regions (organization_id, region_id) VALUES ($1, $2)";
      for (let i = 0; i < org.regionids.length; i++) {
        await client.query(insertRegionSql, [org.id, org.regionids[i]]);
      }
    }
    await client.query("COMMIT");
    return id;
  } catch (err) {
    console.log(err);
    await client.query("ROLLBACK");
    throw err;
  }
};

const put = async org => {
  const client = await pool.connect();
  try {
    client.query("BEGIN TRANSACTION");
    const sql = `
    UPDATE organizations SET
      name = $1,
      url = $2,
      mission = $3,
      description = $4,
      street = $5,
      suite = $6,
      city = $7,
      state = $8,
      zip = $9,
      latitude = $10,
      longitude = $11,
      phone = $12,
      email = $13
    WHERE id = $14
    `;
    const values = [
      org.name,
      org.url,
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

    await client.query(sql, values);

    const deleteSql =
      "DELETE FROM organization_regions WHERE organization_id = $1";
    await client.query(deleteSql, [org.id]);

    if (org.regionids) {
      const insertRegionSql =
        "INSERT INTO organization_regions (organization_id, region_id) VALUES ($1, $2)";
      for (let i = 0; i < org.regionids.length; i++) {
        await client.query(insertRegionSql, [org.id, org.regionids[i]]);
      }
    }
    return client.query("COMMIT");
  } catch (err) {
    console.log(err);
    await client.query("ROLLBACK");
    throw err;
  }
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
