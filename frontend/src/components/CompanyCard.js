import React from "react";
import "./CompanyCard.scss";

const CompanyCard = ({ org }) => {
  return (
    <div className="organization-card">
      <div className="organization-card-content">
        <div className="organization-img-wrapper">
          <img id="org-img" alt="company logo" src={`/logos/${org.logo}`} />
        </div>
        <h3 id="org-title">{org.name}</h3>
        <p id="org-jobs-available"> {org.job_count} Jobs Available</p>
        <a
          href={org.url}
          id="org-view-more-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          View More
        </a>
      </div>
    </div>
  );
};

export default CompanyCard;
