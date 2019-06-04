import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { loadRequests, approveRequest } from "../../services/verify-service";
import "./AdminControls.scss";

const AdminControls = props => {
  const [requests, setRequests] = useState([]);
  const { role, email } = props.activeUser;
  if (!role) return <Redirect to="/" />;

  useEffect(() => {
    loadRequests().then(result => setRequests(result));
  }, []);

  const approveReq = e => {
    approveRequest(e.target.dataset.email, e.target.dataset.org).then(
      result => {
        setRequests(requests.filter(item => item.email !== result));
      }
    );
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
    </div>
  );
};

export default AdminControls;
