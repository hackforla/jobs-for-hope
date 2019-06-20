import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadRequests, approveRequest } from "../services/verify-service";
import { getAll } from "../services/organization-service";
import "./AdminControls.scss";

const AdminControls = props => {
  const [requests, setRequests] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [org, setOrg] = useState({});
  const { role, organization } = props.activeUser;

  useEffect(() => {
    loadRequests().then(result => setRequests(result));
  }, []);

  useEffect(() => {
    getAll().then(result => {
      setOrgList(
        result.map(org => ({
          name: org.name,
          id: org.id
        }))
      );
    });
  }, []);

  const approveReq = e => {
    approveRequest(e.target.dataset.email, e.target.dataset.org).then(
      result => {
        setRequests(requests.filter(item => item.email !== result));
      }
    );
  };

  const changeOrg = e => {
    setOrg({ id: e.target.value });
  };

  return (
    <div>
      <h1>Admin Control Panel</h1>
      <h2>Pending Requests:</h2>
      {requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="table-header">E-mail</th>
              <th className="table-header">Organization</th>
              <th className="table-header" />
            </tr>
          </thead>
          <tbody>
            {requests.map((item, i) => {
              return (
                <tr className="request-container" key={i}>
                  <td className="request-item">{item.email}</td>
                  <td className="request-item">{item.first_org}</td>
                  <td className="request-item">
                    <button
                      className="approve-btn"
                      data-email={item.email}
                      data-org={item.first_org}
                      onClick={approveReq}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      <h2>Organization Actions:</h2>
      <div className="org-control">
        <select name="organization" className="org-select" onChange={changeOrg}>
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

          {role === "admin" ||
          (role === "employer" && organization.includes(org.name)) ? (
            // when we change organizations from string to an array:
            // activeUser.organization.includes(org.name))) ? (
            <Link to={`/organizations/${org.id}/edit`} id="org-edit-button">
              Edit
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminControls;
