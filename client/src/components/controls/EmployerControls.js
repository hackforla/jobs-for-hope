import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll } from "../../services/organization-service";
import "./EmployerControls.scss";

const EmployerControls = props => {
  const [orgList, setOrgList] = useState([]);
  const [org, setOrg] = useState({});
  const { role, organization } = props.activeUser;

  useEffect(() => {
    getAll().then(result => {
      let orgList = result.filter(org => {
        return organization.includes(org.id);
      });
      setOrgList(
        orgList.map(org => ({
          name: org.name,
          id: org.id
        }))
      );
      setOrg({
        id: orgList[0].id
      });
    });
  }, []);

  const changeOrg = e => {
    setOrg({ id: Number(e.target.value) });
  };

  return (
    <div className="employer-main">
      <div className="jobs-container">
        <h2>Jobs:</h2>
        {role === "employer" ? (
          <Link to={`/jobs/form/new`} id="new-job-btn">
            Post a Job
          </Link>
        ) : null}
        create jobs, edit jobs, delete jobs
      </div>
      <div className="org-info-container">
        <h2>Organization Info:</h2>
        edit org info, associate another org
        <div className="org-control">
          <select
            name="organization"
            className="org-select"
            onChange={changeOrg}
            value={org.id}
          >
            {orgList.map((org, i) => {
              return (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              );
            })}
          </select>
          <div id="org-buttons-wrapper">
            <Link to={`/organizations/${org.id}`} id="org-details-button">
              Details
            </Link>
            {role === "employer" && organization.includes(org.id) ? (
              <Link to={`/organizations/${org.id}/edit`} id="org-edit-button">
                Edit
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerControls;
