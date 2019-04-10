import React from "react";
import "./CompanyCard.scss";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

const CompanyCard = ({ org }) => {
  return (
    <div className="organization-card">
      <div className="organization-card-content">
        <div className="organization-img-wrapper">
          <img id="org-img" alt="company logo" src={`/logos/${org.logo}`} />
        </div>
        <h3 id="org-title">{org.name}</h3>
        <div style={{ height: "10%" }}>
          <Link to={"/jobs/" + org.id} id="org-jobs-available">
            {org.job_count} Jobs Available
          </Link>
        </div>

        <a
          href={`/organizationView/${org.id}`}
          id="org-view-more-link"
        >
          View More
        </a>
      </div>
    </div>
  );
};

export default withRouter(CompanyCard);
