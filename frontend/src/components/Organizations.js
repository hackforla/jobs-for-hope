import React from 'react';
import CompanyCard from './CompanyCard';
import Banner from './Banner';

const Organizations = ({ organizationData }) => (
  <div>
      <Banner titleUpper='Organizations' titleLower='Involved' imageName='city' />
      <div className = "organization-cards-container">
        {organizationData.map( (org, index) =>
          <CompanyCard key={index}
          org={org}
        />
        )}
      </div>
  </div>
);

export default Organizations;
