import React, { Component } from "react";
import { Redirect } from "react-router";
import "./Account.scss";
import AdminControls from "./AdminControls";
import EmployerControls from "./EmployerControls";

class Account extends Component {
  render() {
    const { role, email } = this.props.activeUser;
    //   const { requests } = this.state;
    if (!role) return <Redirect to="/" />;
    return (
      <div className="account-container">
        {role === "admin" ? (
          <AdminControls
            activeUser={this.props.activeUser}
            pendingRequests={this.props.pendingRequests}
          />
        ) : role === "employer" ? (
          <EmployerControls activeUser={this.props.activeUser} />
        ) : role !== "pending" ? (
          <h1>{`Account Dashboard for ${email}`}</h1>
        ) : (
          <h1>
            You are not currently approved to post jobs or edit site
            information. Please contact the site's admin for approval.
          </h1>
        )}
      </div>
    );
  }
}

export default Account;
