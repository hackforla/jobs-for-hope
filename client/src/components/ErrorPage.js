import React from "react";
import "./ErrorPage.scss";

const ErrorPage = ({ match }) => {
  const errNum = match.params.num;
  return (
    <div className="error-container">
      <h1>Error: no data for user. Your link may have expired.</h1>
      <p>Error Number: {errNum}</p>
    </div>
  );
};

export default ErrorPage;
