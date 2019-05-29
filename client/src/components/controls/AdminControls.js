import React, { Component } from "react";
import { Redirect } from "react-router";
import { loadRequests, approveRequest } from "../../services/verify-service";
import "./AdminControls.scss";

class AdminControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: []
    };
  }
  componentDidMount() {
    loadRequests().then(result => this.setState({ requests: result }));
  }

  approveReq = e => {
    approveRequest(e.target.dataset.email, e.target.dataset.org).then(
      result => {
        this.setState(prevState => ({
          requests: prevState.requests.filter(item => item.email !== result)
        }));
      }
    );
  };

  render() {
    const { role, email } = this.props.activeUser;
    const { requests } = this.state;
    if (!role) return <Redirect to="/" />;
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
                        onClick={this.approveReq}
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
  }
}

export default AdminControls;
