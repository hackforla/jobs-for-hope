import React from 'react';
import CompanyCard from './CompanyCard';

const Organizations = ({ organizationData }) => (
  <div className = "organization-cards-container">
    {organizationData.map( (org, index) =>
      <CompanyCard key={index}
        org={org}
      />
    )}
  </div>
);

export default Organizations;