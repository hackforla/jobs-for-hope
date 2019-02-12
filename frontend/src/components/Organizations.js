import React from 'react'
import CompanyCard from './CompanyCard'
import Banner from './Banner'
import './Organizations.scss'

const Organizations = ({ organizationData }) => (
  <div>
    <Banner titleUpper='Organizations' titleLower='Involved' imageName='city' />
    <div className='orgs-intro'>
      <h2 className='intro-h2'>Join the Fight Against Homelessness:</h2>
      <br />
      <p>
          Homeless service providers thoroughout Los Angeles county are looking for qualified, motivated individuals to join the vital field of homeless services. It's a meaningful way to contribute to the movement to combat and prevent homelessness across the county--and the "Help Wanted" sign is out.
      </p>
    </div>
    <div className='organization-cards-container'>
      {organizationData.map((org, index) =>
        <CompanyCard key={index}
          org={org}
        />
      )}
    </div>
  </div>
)

export default Organizations
