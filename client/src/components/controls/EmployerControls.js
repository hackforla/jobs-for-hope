import React, { Component } from "react";
import { Redirect } from "react-router";
import { loadRequests, approveRequest } from "../../services/verify-service";
import "./EmployerControls.scss";

class EmployerControls extends Component {
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
    approveRequest(e.target.dataset.email).then(result => {
      this.setState(prevState => ({
        requests: prevState.requests.filter(item => item.email !== result)
      }));
    });
  };

  render() {
    const { role, email } = this.props.activeUser;
    const { requests } = this.state;
    if (!role) return <Redirect to="/" />;
    return (
      <div className="employer-main">
        <div className="jobs-container">
          <h2>Jobs:</h2>
        </div>
        <div className="org-info-container">
          <h2>Organization Info:</h2>
        </div>
      </div>
    );
  }
}

export default EmployerControls;
