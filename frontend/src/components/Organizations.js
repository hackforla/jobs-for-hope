import React from 'react';
import CompanyCard from './CompanyCard';


//have to map it to hardcode for now
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