import React from 'react';
import CompanyCard from './CompanyCard';
import Banner from './Banner';


//have to map it to hardcode for now
const Organizations = () => {
  return(
    <div>
      <Banner titleUpper='Organizations' titleLower='Involved' imageName='city' />
      <CompanyCard />
    </div>
  );
}


export default Organizations;
