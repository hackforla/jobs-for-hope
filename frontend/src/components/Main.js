import React from 'react';
import SearchBox from './SearchBox';
import JobPostings from './JobPostings';
import SideFilter from './SideFilter';

const Main = ({ onSearchChange, onZipSearchChange, filteredJobs, checkedEmploymentType, onSetEmploymentTypeFT, onSetEmploymentTypePT }) => (
  <div>
    <SearchBox
      onSearchChange={onSearchChange}
      onZipSearchChange={onZipSearchChange}


    />
    <SideFilter
      onSetEmploymentTypeFT={onSetEmploymentTypeFT}
      onSetEmploymentTypePT={onSetEmploymentTypePT}
      checkedEmploymentType={checkedEmploymentType}
    />
    <section role="tablist" className="recent-postings-container">
      <h2 className="recent-postings-title"> Recent Job Postings</h2>
      <ul>
      {filteredJobs.map( (job, index) =>
        <li key={index}>
        <JobPostings
          job={job}
        />
        </li>
      )}
      </ul>
  </section>
  </div>
);

export default Main;


  // Todo: <SearchByFilter />