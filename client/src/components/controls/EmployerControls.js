import React from "react";
import { Redirect } from "react-router";
import "./EmployerControls.scss";

const EmployerControls = props => {
  const { role, email } = props.activeUser;
  if (!role) return <Redirect to="/" />;
  return (
    <div className="employer-main">
      <div className="jobs-container">
        <h2>Jobs:</h2>
        create jobs, edit jobs, delete jobs
      </div>
      <div className="org-info-container">
        <h2>Organization Info:</h2>
        edit org info, associate another org
      </div>
    </div>
  );
};

export default EmployerControls;
